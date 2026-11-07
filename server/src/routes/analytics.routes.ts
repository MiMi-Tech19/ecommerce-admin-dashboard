
import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/dashboard', authenticate, getDashboardAnalytics);

export default router;
