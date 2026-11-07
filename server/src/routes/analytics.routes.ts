
import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analytics.controller.js';
import {
  getRealtimeVisitors,
  getVisitorAnalytics,
} from '../controllers/visitors.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/dashboard', authenticate, getDashboardAnalytics);
router.get('/visitors', authenticate, getVisitorAnalytics);
router.get('/visitors/realtime', authenticate, getRealtimeVisitors);

export default router;

