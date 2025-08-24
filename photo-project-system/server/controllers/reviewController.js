import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Photographer from '../models/Photographer.js';
import { sendEmail } from '../utils/sendEmail.js';

export const addReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    const ratingValue = Math.round(Number(rating) * 10) / 10;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.user) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    if (booking.status !== 'completed') return res.status(400).json({ message: 'Session not completed' });

    const review = await Review.create({
      booking: booking._id,
      user: booking.user,
      photographer: booking.photographer,
      rating: ratingValue,
      comment
    });

    // Update photographer rating
    const photographer = await Photographer.findById(booking.photographer);
    const avg = await Review.aggregate([
      { $match: { photographer: booking.photographer } },
      { $group: { _id: '$photographer', rating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (avg[0]) {
      photographer.rating = Math.round(avg[0].rating * 10) / 10;
      photographer.ratingCount = avg[0].count;
      await photographer.save();

      // Optional email
      if (photographer.email) {
        await sendEmail(
          photographer.email,
          'You received a new review!',
          `<p>Hello ${photographer.displayName},</p>
           <p>You received a new review from ${req.user.name}:</p>
           <p>Rating: ${ratingValue} ⭐</p>
           <p>Comment: ${comment}</p>`
        );
      }
    }

    res.status(201).json(review);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
