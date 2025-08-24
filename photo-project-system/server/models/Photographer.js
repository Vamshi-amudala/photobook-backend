import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const photographerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  displayName: { type: String, required: true },
  pricing: {
    currency: { type: String, default: 'INR' },
    baseRate: { type: Number, default: 5000 },
    packages: {
      basic: { price: Number, duration: String, services: [String] },
      premium: { price: Number, duration: String, services: [String] },
      deluxe: { price: Number, duration: String, services: [String] }
    }
  },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  portfolio: [{ url: String, caption: String, genre: String, price: Number }],
  status: { type: String, enum: ['pending', 'approved', 'blocked'], default: 'pending' },
  profilePic: { type: String, default: "" }
}, { timestamps: true });

photographerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

photographerSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('Photographer', photographerSchema);
