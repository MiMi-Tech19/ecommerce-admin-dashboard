
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import { prisma } from './config/database.js';
import productsRouter from './routes/products.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import ordersRouter from './routes/orders.routes.js';
import authRouter from './routes/auth.routes.js';
import analyticsRouter from './routes/analytics.routes.js';
import usersRouter from './routes/users.routes.js';
import cookieParser from 'cookie-parser';
import sessionsRouter from './routes/sessions.routes.js';
import adminSessionsRouter from './routes/admin-sessions.routes.js';

const app = express();

const PORT = Number(process.env.PORT) || 5000;


app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/admin/sessions', adminSessionsRouter);
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'E-commerce Admin API is running!',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health/database', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: 'Database connection successful!',
    });
  } catch (error) {
    console.error('Database health check failed:', error);

    res.status(503).json({
      success: false,
      message: 'Database connection failed.',
    });
  }
});

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

