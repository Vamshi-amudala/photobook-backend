import { Router } from 'express';
import { body } from 'express-validator';
import { 
  register, 
  login, 
  updatePhotographerProfile, 
  getPhotographerDashboard 
} from '../controllers/photographerAuthController.js';
import { auth, permitPhotographer } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('phone').isLength({ min: 10, max: 10 }).matches(/^[0-9]+$/),
    body('displayName').notEmpty()
  ],
  register
);


router.post('/login', login);
router.put('/profile', auth, permitPhotographer, updatePhotographerProfile);
router.get('/dashboard', auth, permitPhotographer, getPhotographerDashboard);

export default router;
