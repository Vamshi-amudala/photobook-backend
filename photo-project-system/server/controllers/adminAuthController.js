import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import Admin from '../models/Admin.js';

function sign(admin) {
  return jwt.sign({ 
    id: admin._id, 
    type: 'admin', 
    name: admin.name,
    permissions: admin.permissions
  }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES || '7d' 
  });
}

export const login = async (req, res) => {
  try{
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase(), isActive: true });
  if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
  
  const ok = await admin.comparePassword(password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  
  
  admin.lastLogin = new Date();
  await admin.save();
  
  return res.json({ 
    token: sign(admin), 
    admin: { 
      id: admin._id, 
      name: admin.name, 
      email: admin.email,
      permissions: admin.permissions
    } 
  });
} catch (err) {
  console.error('Login error :', err.message);
  return res.status(500).json({ message: 'Internal server error' });
}
};