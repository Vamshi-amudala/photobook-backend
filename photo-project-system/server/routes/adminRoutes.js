import { Router } from 'express';
import { auth, permitAdmin } from '../middleware/auth.js';
import { approveProfile, stats } from '../controllers/adminController.js';

const router = Router();

router.patch('/profiles', auth, permitAdmin, approveProfile);
router.get('/stats', auth, permitAdmin, stats);

export default router;
