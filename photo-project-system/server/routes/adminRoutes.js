import { Router } from 'express';
import { auth, permitAdmin} from '../middleware/auth.js';
import {
  approveProfile,
  listUsers,
  listPhotographers,
  listPhotographersByStatus, deleteUser, blockPhotographer, blockUser, deletePhotographer 
} from '../controllers/adminController.js';

const router = Router();

router.patch('/profiles', auth, permitAdmin, approveProfile);
// router.get('/stats', auth, permitAdmin, stats);
router.get('/users', auth, permitAdmin, listUsers);
router.patch('/users/block', auth, permitAdmin, blockUser);
router.delete('/users', auth, permitAdmin, deleteUser);
router.get('/photographers', auth, permitAdmin, listPhotographers);
router.get('/photographers/status', auth, permitAdmin, listPhotographersByStatus);
router.patch('/photographers/block', auth, permitAdmin, blockPhotographer);
router.delete('/photographers', auth, permitAdmin, deletePhotographer);

export default router;
