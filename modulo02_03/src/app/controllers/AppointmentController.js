import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    // http://localhost:3333/appointments?page=1
    const { page = 1 } = req.query;

    // valida se o parametro page tem valor atribuido
    if (!page) {
      return res.status(400).json({ error: 'Parameter page cannot be null' });
    }

    // valida se o parametro page é maior ou igual a zero
    if (page <= 0) {
      return res
        .status(400)
        .json({ error: 'Parameter page must be greater than zero' });
    }

    const appointmentsPerPage = 20;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: appointmentsPerPage, // volta 20 resultados por página
      offset: (page - 1) * appointmentsPerPage, // pula as paginas
      attributes: ['id', 'date', 'past', 'cancelable'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json({ appointments });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    /*
      Check if provider_id and req.userId are the same, a provider can't schedule with itself
    */
    if (provider_id === req.userId) {
      return res.status(400).json({
        error: 'A provider cannot schedule an appointment with itself',
      });
    }

    /*
      Check if provider_id is a provider
    */
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    // parseISO transforma em objeto date do javascript
    // o startOfHour sempre pega o inicio da hora, se passar 19h30, ele pega 19h00
    const hourStart = startOfHour(parseISO(date));

    // verifica se a data passada é anterior a data atual
    /**
     *  Check for past dates
     */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     *  Check date availability
     */
    const checkDateAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkDateAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId, // req.userId vem do middleware de autenticação /src/app/middlewares/auth.js
      provider_id,
      date,
    });

    /**
     *  Notify appointment provider
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    const dateWithSub = subHours(appointment.date, 2); // remove duas horas do horário do agendamento

    // appointment.date  = 13:00h
    // dateWithSub       = 11:00h
    // now               = 11:25h
    // horário limite para cancelar agendamento já passou
    // usuário está a menos de 2 horas de distância
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance.',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
