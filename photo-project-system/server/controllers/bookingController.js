import Booking from '../models/Booking.js';
import Photographer from '../models/Photographer.js';

export const createBooking = async (req, res) => {
  const { photographerId, date, timeSlot, notes } = req.body;
 
  const photographer = await Photographer.findOne({ _id: photographerId, status: 'approved', isActive: true });
  if (!photographer) return res.status(400).json({ message: 'Photographer not available' });
  const booking = await Booking.create({ user: req.user.id, photographer: photographerId, date, timeSlot, notes });
  res.status(201).json(booking);
};

export const myBookings = async (req, res) => {
  const userType = req.user.type || req.user.role;
  const filter = userType === 'photographer' ? { photographer: req.user.id } : { user: req.user.id };
  const items = await Booking.find(filter).populate('photographer', 'displayName name').populate('user', 'name').sort('-createdAt');
  res.json(items);
};

export const updateStatus = async (req, res) => {
  const { id } = req.params; // booking id
  const { status } = req.body; // approved | rejected | completed
  const booking = await Booking.findById(id);
  if (!booking) return res.status(404).json({ message: 'Not found' });
  // Only the assigned photographer or admin can change pending -> approved/rejected; completed allowed by photographer
  if (req.user.type === 'photographer' && String(booking.photographer) !== req.user.id)
    return res.status(403).json({ message: 'Forbidden' });
  booking.status = status;
  await booking.save();
  res.json(booking);
};
