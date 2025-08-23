import crypto from 'crypto';
import { validationResult } from 'express-validator';
import PasswordReset from '../models/PasswordReset.js';
import User from '../models/User.js';
import Photographer from '../models/Photographer.js';
import Admin from '../models/Admin.js';

// Helper function to get user model based on type
const getUserModel = (userType) => {
  switch (userType) {
    case 'user': return User;
    case 'photographer': return Photographer;
    case 'admin': return Admin;
    default: throw new Error('Invalid user type');
  }
};

export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
  try {
    const { email, userType } = req.body;
    
    // Check if user exists
    const UserModel = getUserModel(userType);
    const user = await UserModel.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    // Save reset token
    await PasswordReset.create({
      email,
      token,
      userType,
      expiresAt
    });
    
    // In a real application, you would send an email here
    // For now, we'll return the token (in production, send via email)
    return res.json({ 
      message: 'Password reset link sent to your email',
      token: token, // Remove this in production
      expiresAt: expiresAt
    });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
  try {
    const { token, newPassword, userType } = req.body;
    
    // Find reset token
    const resetRecord = await PasswordReset.findOne({ 
      token, 
      userType, 
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetRecord) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Get user model and update password
    const UserModel = getUserModel(userType);
    const user = await UserModel.findOne({ email: resetRecord.email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Mark token as used
    resetRecord.isUsed = true;
    await resetRecord.save();
    
    return res.json({ message: 'Password reset successfully' });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyResetToken = async (req, res) => {
  try {
    const { token, userType } = req.params;
    
    const resetRecord = await PasswordReset.findOne({ 
      token, 
      userType, 
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetRecord) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    return res.json({ message: 'Token is valid', email: resetRecord.email });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
