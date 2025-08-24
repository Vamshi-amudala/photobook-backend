import Booking from '../models/Booking.js';
import Photographer from '../models/Photographer.js';


export const createBooking = async (req, res) => {
  try {
    const { photographer: photographerId, date, timeSlot, package: selectedPackage, notes } = req.body;

    
    const photographer = await Photographer.findById(photographerId);
    if (!photographer || photographer.status !== 'approved') {
      return res.status(404).json({ message: 'Photographer not found or not approved' });
    }

    
    if (!['basic','premium','deluxe'].includes(selectedPackage)) {
      return res.status(400).json({ message: 'Invalid package selected' });
    }

    
    const existingBooking = await Booking.findOne({ 
      photographer: photographerId, 
      date, 
      timeSlot, 
      status: { $in: ['pending','approved'] } 
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'Selected slot is already booked' });
    }

    
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


export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

      const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });


    if (!['pending','approved','rejected','completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

   if (booking.status === 'rejected') {
    return res.status(400).json({ message: "Already rejected, cannot update again..!" });
    }
    
    if (['rejected', 'completed'].includes(booking.status)) {
        return res.status(400).json({ message: `Booking is ${booking.status}, cannot update again..!` });
    }
    
    
    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking status updated', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
