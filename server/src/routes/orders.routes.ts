import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from '../controllers/orders.controller.js';
import {
  authenticate,
  authorize,
} from '../middleware/auth.middleware.js';

const router = Router();

// All order routes require authentication.
router.use(authenticate);

// STAFF and ADMIN can view and create orders.
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);

// Only ADMIN can update order status.
router.patch(
  '/:id/status',
  authorize('ADMIN'),
  updateOrderStatus,
);

export default router;