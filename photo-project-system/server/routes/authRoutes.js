import { Router } from 'express';
import { body } from 'express-validator';
import { login, register, updateUserProfile } from '../controllers/authController.js';
import {auth, permitUser} from '../middleware/auth.js'

const router = Router();

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['user', 'photographer', 'admin'])
], register);

router.post('/login', login);

router.put('/update', auth, permitUser, [
  body('name').optional().isString(),
  body('phone').optional().isLength({ min: 10, max:10 })
], updateUserProfile);


export default router;
