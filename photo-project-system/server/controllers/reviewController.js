import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Photographer from '../models/Photographer.js';

export const addReview = async (req, res) => {
  const { bookingId, rating, comment } = req.body;
  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (String(booking.user) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  if (booking.status !== 'completed') return res.status(400).json({ message: 'Session not completed' });

  const review = await Review.create({
    booking: booking._id,
    user: booking.user,
    photographer: booking.photographer,
    rating,
    comment
  });

  // update aggregate rating
  const photographer = await Photographer.findById(booking.photographer);
  const avg = await Review.aggregate([
    { $match: { photographer: booking.photographer } },
    { $group: { _id: '$photographer', rating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (avg[0]) {
    photographer.rating = Number(avg[0].rating.toFixed(2));
    photographer.ratingCount = avg[0].count;
    await photographer.save();
  }
  res.status(201).json(review);
};
