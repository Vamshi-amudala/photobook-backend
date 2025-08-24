import Photographer from '../models/Photographer.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js'; // ✅ missing import added

// Approve or block photographer profile
export const approveProfile = async (req, res) => {
  const { photographerId, status } = req.body;

  const photographer = await Photographer.findByIdAndUpdate(
    photographerId,
    { status },
    { new: true }
  );

  if (!photographer) {
    return res.status(404).json({ message: "Photographer not found" });
  }

  if (status === 'approved') {
    await sendEmail(
      photographer.email,
      "Profile Approved ✅",
      `<p>Hello ${photographer.displayName},</p>
       <p>Your profile has been approved. You can now start accepting bookings!</p>`
    );
  } else if (status === 'blocked') {
    await sendEmail(
      photographer.email,
      "Profile Rejected ❌",
      `<p>Hello ${photographer.displayName},</p>
       <p>Unfortunately, your profile registration was rejected. Contact support for details.</p>`
    );
  }

  res.json(photographer);
};

// Admin dashboard stats
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const blockedUsers = await User.countDocuments({ isActive: false });
    const activePhotographers = await Photographer.countDocuments({ status: 'approved', isActive: true });
    const photographersPending = await Photographer.countDocuments({ status: 'pending' });
    const bookingsPending = await Booking.countDocuments({ status: 'pending' });
    const bookingsCompleted = await Booking.countDocuments({ status: 'completed' });
    const pendingApprovals = await Photographer.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      blockedUsers,
      activePhotographers,
      photographersPending,
      bookingsPending,
      bookingsCompleted,
      pendingApprovals
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List all users
export const listUsers = async (req, res) => {
  const users = await User.find({}, 'name email role isActive createdAt updatedAt');
  res.json(users);
};

// List all photographers
export const listPhotographers = async (req, res) => {
  const photographers = await Photographer.find({}, 'name email displayName status isActive createdAt updatedAt');
  res.json(photographers);
};

// List photographers by status
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
  const photographer = await Photographer.findByIdAndUpdate(
    photographerId,
    { isActive: false, status: 'blocked' },
    { new: true }
  );
  res.json(photographer);
};

// Delete a photographer
export const deletePhotographer = async (req, res) => {
  const { photographerId } = req.body;
  await Photographer.findByIdAndDelete(photographerId);
  res.json({ message: 'Photographer deleted successfully' });
};
