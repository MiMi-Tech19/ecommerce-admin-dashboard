import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller.js';
import {
  authenticate,
  authorize,
} from '../middleware/auth.middleware.js';

const router = Router();

// All product routes require authentication.
router.use(authenticate);

// STAFF and ADMIN can view products.
router.get('/', getProducts);
router.get('/:id', getProductById);

// Only ADMIN can manage products.
router.post('/', authorize('ADMIN'), createProduct);
router.put('/:id', authorize('ADMIN'), updateProduct);
router.delete('/:id', authorize('ADMIN'), deleteProduct);

export default router;