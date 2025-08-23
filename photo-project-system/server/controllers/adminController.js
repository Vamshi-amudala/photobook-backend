import Photographer from '../models/Photographer.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

export const approveProfile = async (req, res) => {
  const { photographerId, status } = req.body; // approved | blocked | pending
  const photographer = await Photographer.findByIdAndUpdate(photographerId, { status }, { new: true });
  res.json(photographer);
};

export const stats = async (req, res) => {
  const [users, photographersPending, bookingsPending] = await Promise.all([
    User.countDocuments(),
    Photographer.countDocuments({ status: 'pending' }),
    Booking.countDocuments({ status: 'pending' })
  ]);
  res.json({ users, photographersPending, bookingsPending });
};
