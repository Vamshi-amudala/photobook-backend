import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import Photographer from '../models/Photographer.js';

function sign(photographer) {
  return jwt.sign({ 
    id: photographer._id, 
    type: 'photographer', 
    name: photographer.name 
  }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES || '7d' 
  });
}

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
  try {
    const { name, email, password,phone, displayName, bio, genres, pricing, location } = req.body;
    
    const exists = await Photographer.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    
    const photographer = await Photographer.create({ 
      name, 
      email, 
      password, 
      phone,
      displayName, 
      bio, 
      genres, 
      pricing, 
      location 
    });
    
    return res.status(201).json({ 
      token: sign(photographer), 
      photographer: { 
        id: photographer._id, 
        name: photographer.name, 
        email: photographer.email,
        phone: photographer.phone,
        displayName: photographer.displayName,
        status: photographer.status
      } 
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const photographer = await Photographer.findOne({ email, isActive: true });
  if (!photographer) return res.status(400).json({ message: 'Invalid credentials' });
  
  const ok = await photographer.comparePassword(password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  
  // Update last login
  photographer.lastLogin = new Date();
  await photographer.save();
  
  return res.json({ 
    token: sign(photographer), 
    photographer: { 
      id: photographer._id, 
      name: photographer.name, 
      email: photographer.email,
      phone: photographer.phone,
      displayName: photographer.displayName,
      status: photographer.status
    } 
  });
};

