import { Router } from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/photographerAuthController.js';

const router = Router();

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone must be exactly 10 digits")
    .matches(/^[0-9]+$/)
    .withMessage("Phone must contain only numbers"),
  body('displayName').notEmpty(),
  body('pricing.baseRate').isNumeric()
], register);

router.post('/login', login);

export default router;
