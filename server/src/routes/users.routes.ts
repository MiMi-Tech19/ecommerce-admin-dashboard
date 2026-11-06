import { Router } from 'express';
import {
  getUsers,
  updateUserRole,
} from '../controllers/users.controller.js';
import {
  authenticate,
  authorize,
} from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/', getUsers);
router.patch('/:id/role', updateUserRole);

export default router;