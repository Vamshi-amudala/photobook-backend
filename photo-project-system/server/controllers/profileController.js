import Photographer from '../models/Photographer.js';
export const listApproved = async (req, res) => {
  try {
    const { city, genre, sortBy = 'pricing.baseRate', sortOrder = 'asc', page = 1, limit = 10 } = req.query;

   
    const filter = { status: 'approved', isActive: true };

   
    if (city) filter['location.city'] = new RegExp(`^${city}$`, 'i');
    if (genre) filter.genres = { $in: [new RegExp(genre, 'i')] };

  
    const sortField = sortBy === 'genre' ? 'genres' : 'pricing.baseRate';
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

    const photographers = await Photographer.find(filter, '-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort(sort);

    res.json(photographers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
