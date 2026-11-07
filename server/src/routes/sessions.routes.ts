import { Router } from 'express';
import {
  getActiveSessions,
  getSessionHistory,
  revokeSession,
} from '../controllers/sessions.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getActiveSessions);
router.get('/history', getSessionHistory);
router.delete('/:id', revokeSession);

export default router;