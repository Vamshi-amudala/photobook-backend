import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, updatePhotographerProfile } from '../controllers/photographerAuthController.js';
import { auth, permitPhotographer } from '../middleware/auth.js';

const router = Router();

// Register & login routes (public)
router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body("phone").isLength({ min: 10, max: 10 }).matches(/^[0-9]+$/),
  body('displayName').notEmpty(),
  body('pricing.baseRate').isNumeric(),
  body('profilePic').optional().isURL()
], register);

router.post('/login', login);

// Protected update route
router.put('/update', auth, permitPhotographer, [
  body("phone").optional().isLength({ min: 10, max: 10 }).matches(/^[0-9]+$/),
  body("displayName").optional().isString(),
  body("bio").optional().isString(),
  body("genres").optional().isArray(),
  body("pricing.baseRate").optional().isNumeric(),
  body("profilePic").optional().isURL()
], updatePhotographerProfile);

export default router;
