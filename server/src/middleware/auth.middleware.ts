import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'ADMIN' | 'STAFF';
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

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
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
    typeof decoded.userId !== 'string'
  ) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User account not found.',
    });
  }

  req.user = {
    userId: user.id,
    role: user.role,
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