import { Router } from 'express';
import { getAllUserSessions } from '../controllers/admin-sessions.controller.js';
import {
  authenticate,
  authorize,
} from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/', getAllUserSessions);

export default router;