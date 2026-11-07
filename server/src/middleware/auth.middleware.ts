
import type { Request, Response, NextFunction } from 'express';
import { createHash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'ADMIN' | 'STAFF';
    sessionId: string;
  };
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  const token =
    req.cookies?.authToken ||
    (authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      success: false,
      message: 'Authentication service is not configured.',
    });
  }

  let decoded: string | jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }

  if (
    typeof decoded === 'string' ||
    typeof decoded.userId !== 'string' ||
    typeof decoded.sid !== 'string' ||
    decoded.sub !== decoded.userId
  ) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
    });
  }

  const session = await prisma.userSession.findUnique({
    where: { id: decoded.sid },
    include: {
      user: {
        select: {
          id: true,
          role: true,
        },
      },
    },
  });

  if (
    !session ||
    session.userId !== decoded.userId ||
    session.user.id !== decoded.userId ||
    session.revokedAt ||
    session.expiresAt <= new Date()
  ) {
    return res.status(401).json({
      success: false,
      message: 'Your session is invalid or has expired. Please log in again.',
    });
  }

  const tokenHash = createHash('sha256')
    .update(token)
    .digest('hex');

  if (session.tokenHash !== tokenHash) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication session. Please log in again.',
    });
  }

  // Update activity at most once every five minutes per session.
  const activityThreshold = new Date(Date.now() - 5 * 60 * 1000);

  if (session.lastActive < activityThreshold) {
    await prisma.userSession.updateMany({
      where: {
        id: session.id,
        revokedAt: null,
        lastActive: {
          lt: activityThreshold,
        },
      },
      data: {
        lastActive: new Date(),
      },
    });
  }

  req.user = {
    userId: session.user.id,
    role: session.user.role,
    sessionId: session.id,
  };

  return next();
}

export function authorize(...allowedRoles: Array<'ADMIN' | 'STAFF'>) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    }

    return next();
  };
}
