import mongoose from 'mongoose';

    const bookingSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      photographer: { type: mongoose.Schema.Types.ObjectId, ref: 'Photographer', required: true },
      date: { type: Date, required: true },
      timeSlot: { type: String, required: true },
      package: { type: String, enum: ['basic','premium','deluxe'], required: true },
      notes: String,
      status: { type: String, enum: ['pending','approved','rejected','completed'], default: 'pending' }
    }, { timestamps: true }
  
  );


export default mongoose.model('Booking', bookingSchema);
