import { Router } from 'express';
import { body } from 'express-validator';
import { login} from '../controllers/adminAuthController.js';
import { auth, permit } from '../middleware/auth.js';
import { getAdminDashboard } from '../controllers/adminController.js';

const router = Router();

router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], login);

router.get('/dashboard', auth, permit('admin'), getAdminDashboard);

export default router;
