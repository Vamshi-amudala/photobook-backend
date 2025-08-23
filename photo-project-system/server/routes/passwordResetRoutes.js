import { Router } from 'express';
import { body } from 'express-validator';
import { forgotPassword, resetPassword, verifyResetToken } from '../controllers/passwordResetController.js';

const router = Router();

router.post('/forgot', [
  body('email').isEmail(),
  body('userType').isIn(['user', 'photographer', 'admin'])
], forgotPassword);

router.post('/reset', [
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  body('userType').isIn(['user', 'photographer', 'admin'])
], resetPassword);

router.get('/verify/:userType/:token', verifyResetToken);

export default router;
