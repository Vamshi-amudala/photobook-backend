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

// Registration: minimal info
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
  try {
    const { name, email, password, displayName, phone, location } = req.body;
    
    const exists = await Photographer.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    
    const photographer = await Photographer.create({ 
      name, 
      email, 
      password, 
      displayName, 
      phone,
      status: 'pending', 
      isActive: true,
      pricing: { baseRate: 5000, currency: 'INR' }, 
      location, 
      genres: [],
      bio: "",
      profilePic: "",
      portfolio: []
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

// Login remains unchanged
export const login = async (req, res) => {
  const { email, password } = req.body;
  const photographer = await Photographer.findOne({ email, isActive: true });
  if (!photographer) return res.status(400).json({ message: 'Invalid credentials' });
  
  const ok = await photographer.comparePassword(password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  
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

// Profile update: only allowed after admin approval
export const updatePhotographerProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const photographerId = req.user.id;
    const updates = req.body;

    const photographer = await Photographer.findById(photographerId);
    if (!photographer) return res.status(404).json({ message: "Photographer not found" });

    if (photographer.status !== 'approved') {
      return res.status(403).json({ message: "Profile update allowed only after admin approval" });
    }

    if (updates.portfolio) {
    photographer.portfolio.push(...updates.portfolio);
    delete updates.portfolio;
  }

      for (const key in updates) {
    if (updates.hasOwnProperty(key)) {
      photographer[key] = updates[key];
    }
  }

    await photographer.save();

    return res.json({
      message: "Profile updated successfully",
      photographer
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
