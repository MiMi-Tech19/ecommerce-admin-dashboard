import { Router } from 'express';
import {
  getUsers,
  updateMyProfile,
  updateUserRole,
} from '../controllers/users.controller.js';
import {
  authenticate,
  authorize,
} from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

// Both Admin and Staff can update their own profile.
router.patch('/me', updateMyProfile);

// Only Admins can manage other users.
router.use(authorize('ADMIN'));

router.get('/', getUsers);
router.patch('/:id/role', updateUserRole);

export default router;