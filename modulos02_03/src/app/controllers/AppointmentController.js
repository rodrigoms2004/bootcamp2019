import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

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
      attributes: ['id', 'date'],
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
      Check if provider_id is a provider
    */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
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

    console.log('XPTO', req.user_id);
    const appointment = await Appointment.create({
      user_id: req.userId, // req.userId vem do middleware de autenticação /src/app/middlewares/auth.js
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
