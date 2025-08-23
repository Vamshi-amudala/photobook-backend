import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const photographerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone:{ type : String, require:true, minlength:10, maxlength:10},
    displayName: { type: String, required: true },
    bio: String,
    genres: [String], // wedding, fashion, events, etc.
    pricing: {
      currency: { type: String, default: 'INR' },
      baseRate: { type: Number, required: true }, // per hour/session
    },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    portfolio: [{ url: String, caption: String }],
    status: { type: String, enum: ['pending', 'approved', 'blocked'], default: 'pending' },
    location: { 
      city: String, 
      state: String, 
      country: String 
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

photographerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

photographerSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('Photographer', photographerSchema);
