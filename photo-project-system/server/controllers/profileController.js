import Photographer from '../models/Photographer.js';

export const listApproved = async (req, res) => {
  const { q, city, genre, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  
  const filter = { status: 'approved', isActive: true };
  if (city) filter['location.city'] = new RegExp(`^${city}$`, 'i');
  if (genre) filter.genres = new RegExp(`^${genre}$`, 'i');
  if (q) filter.$or = [
    { displayName: new RegExp(q, 'i') },
    { bio: new RegExp(q, 'i') }
  ];

  const photographers = await Photographer.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

  res.json(photographers);
};

export const getMine = async (req, res) => {
  const photographer = await Photographer.findById(req.user.id);
  res.json(photographer || null);
};

export const upsertMine = async (req, res) => {
  const data = req.body;
  const photographer = await Photographer.findByIdAndUpdate(req.user.id, data, { new: true });
  res.json(photographer);
};
