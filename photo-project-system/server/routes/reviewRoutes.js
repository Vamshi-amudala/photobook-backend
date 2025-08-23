import { Router } from 'express';
import { auth, permitUser } from '../middleware/auth.js';
import { addReview } from '../controllers/reviewController.js';

const router = Router();

router.post('/', auth, permitUser, addReview);

export default router;
