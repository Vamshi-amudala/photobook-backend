import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    photographer: { type: mongoose.Schema.Types.ObjectId, ref: 'Photographer', required: true },
    rating: { 
      type: Number, 
      min: 1, 
      max: 5, 
      required: true, 
      set: v => Math.round(v * 10) / 10 // always store 1 decimal
    },
    comment: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
