import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    photographer: { type: mongoose.Schema.Types.ObjectId, ref: 'Photographer', required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // e.g., '10:00-12:00'
    notes: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' }
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
