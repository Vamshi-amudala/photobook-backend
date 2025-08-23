import { Router } from 'express';
import { auth, permitPhotographer } from '../middleware/auth.js';
import { listApproved, getMine, upsertMine } from '../controllers/profileController.js';

const router = Router();

router.get('/', listApproved); // public browse
router.get('/me', auth, permitPhotographer, getMine);
router.put('/me', auth, permitPhotographer, upsertMine);

export default router;
