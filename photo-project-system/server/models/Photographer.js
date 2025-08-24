import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const photographerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { 
      type: String, 
      required: true, 
      minlength: 10, 
      maxlength: 10,
      match: /^[0-9]{10}$/ 
    },
    displayName: { type: String, required: true },
    bio: String,
    genres: [String],
    pricing: {
      currency: { type: String, default: 'INR' },
      baseRate: { type: Number, default: 5000 },
      packages: {
        basic: {
          price: Number,
          duration: String,
          services: [String]
        },
        premium: {
          price: Number,
          duration: String,
          services: [String]
        },
        deluxe: {
          price: Number,
          duration: String,
          services: [String]
        }
      }
    },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    portfolio: [{ url: String, caption: String, genre: String, price: String }],
    status: { type: String, enum: ['pending', 'approved', 'blocked'], default: 'pending' },
    location: { type: String, default: "Hyderabad, Telangana" },
    isActive: { type: Boolean, default: true },
    profilePic: { type: String, default: "" }
  },
  { timestamps: true }
);


// Hash password before saving
photographerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
photographerSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('Photographer', photographerSchema);
