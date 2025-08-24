import Booking from '../models/Booking.js';
import Photographer from '../models/Photographer.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { photographer: photographerId, date, timeSlot, package: selectedPackage, notes } = req.body;

    // Check photographer exists and is approved
    const photographer = await Photographer.findById(photographerId);
    if (!photographer || photographer.status !== 'approved') {
      return res.status(404).json({ message: 'Photographer not found or not approved' });
    }

    // Validate package
    if (!['basic','premium','deluxe'].includes(selectedPackage)) {
      return res.status(400).json({ message: 'Invalid package selected' });
    }

    // Optionally: Check if the slot is already booked
    const existingBooking = await Booking.findOne({ 
      photographer: photographerId, 
      date, 
      timeSlot, 
      status: { $in: ['pending','approved'] } 
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'Selected slot is already booked' });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      photographer: photographerId,
      date,
      timeSlot,
      package: selectedPackage,
      notes
    });

    return res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get bookings for current user or photographer
export const myBookings = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'user') filter.user = req.user.id;
    if (req.user.role === 'photographer') filter.photographer = req.user.id;

    const bookings = await Booking.find(filter)
      
      .populate('user', 'name email');

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update booking status (photographer/admin)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending','approved','rejected','completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking status updated', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
