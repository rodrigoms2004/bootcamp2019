import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    // const { page = 1 } = req.query;

    // // valida se o parametro page tem valor atribuido
    // if (!page) {
    //   return res.status(400).json({ error: 'Parameter page cannot be null' });
    // }

    // // valida se o parametro page é maior ou igual a zero
    // if (page <= 0) {
    //   return res
    //     .status(400)
    //     .json({ error: 'Parameter page must be greater than zero' });
    // }

    const appointmentsPerPage = 20;

    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: 'desc' })
      .limit(appointmentsPerPage);
    // .skip((page - 1) * appointmentsPerPage);

    return res.json(notifications);
  }

  async update(req, res) {
    // const notification = await Notification.findById(req.params.id);
    // opção { new: true } retorna a notificação atualizada
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
