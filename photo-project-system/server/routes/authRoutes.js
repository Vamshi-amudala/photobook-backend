import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController.js';

const router = Router();

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['user', 'photographer', 'admin'])
], register);

router.post('/login', login);

export default router;
