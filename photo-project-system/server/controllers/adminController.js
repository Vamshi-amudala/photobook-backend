import Photographer from '../models/Photographer.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

export const approveProfile = async (req, res) => {
  const { photographerId, status } = req.body; // approved | blocked | pending
  const photographer = await Photographer.findByIdAndUpdate(photographerId, { status }, { new: true });
  res.json(photographer);
};

export const stats = async (req, res) => {
  const [users, photographersPending, activePhotographers, bookingsPending] = await Promise.all([
    User.countDocuments(),
    Photographer.countDocuments({ status: 'pending' }),
    Photographer.countDocuments({ status: 'approved', isActive: true }),
    Booking.countDocuments({ status: 'pending' })
  ]);
  res.json({ users, photographersPending,activePhotographers, bookingsPending });
};

// GET /api/admin/users
export const listUsers = async (req, res) => {
  const users = await User.find({}, 'name email role isActive createdAt updatedAt'); // select only relevant fields
  res.json(users);
};


// GET /api/admin/photographers
export const listPhotographers = async (req, res) => {
  const photographers = await Photographer.find({}, 'name email displayName status isActive createdAt updatedAt');
  res.json(photographers);
};

// Optional: list by status
// GET /api/admin/photographers?status=pending
export const listPhotographersByStatus = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const photographers = await Photographer.find(filter, 'name email displayName status isActive createdAt updatedAt');
  res.json(photographers);
};



// Block a user
export const blockUser = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
  res.json(user);
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { userId } = req.body;
  await User.findByIdAndDelete(userId);
  res.json({ message: 'User deleted successfully' });
};


// Block a photographer
export const blockPhotographer = async (req, res) => {
  const { photographerId } = req.body;
  const photographer = await Photographer.findByIdAndUpdate(photographerId, { isActive: false, status: 'blocked' }, { new: true });
  res.json(photographer);
};

// Delete a photographer
export const deletePhotographer = async (req, res) => {
  const { photographerId } = req.body;
  await Photographer.findByIdAndDelete(photographerId);
  res.json({ message: 'Photographer deleted successfully' });
};
