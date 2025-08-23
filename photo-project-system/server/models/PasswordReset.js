import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    userType: { type: String, enum: ['user', 'photographer', 'admin'], required: true },
    expiresAt: { type: Date, required: true },
    isUsed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Index for automatic cleanup of expired tokens
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('PasswordReset', passwordResetSchema);
