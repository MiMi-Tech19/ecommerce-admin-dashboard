
import { createHash, randomUUID } from 'node:crypto';
import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { jwtExpiresIn } from '../config/auth.config.js';

interface SessionUser {
  id: string;
  role: 'ADMIN' | 'STAFF';
}

export async function createUserSession(
  req: Request,
  user: SessionUser,
): Promise<string> {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  const sessionId = randomUUID();

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      sid: sessionId,
    },
    jwtSecret,
    {
      expiresIn: jwtExpiresIn,
      subject: user.id,
    },
  );

  const decoded = jwt.decode(token);

  if (typeof decoded === 'string' || !decoded?.exp) {
    throw new Error('Unable to determine session expiry.');
  }

  const tokenHash = createHash('sha256')
    .update(token)
    .digest('hex');

  await prisma.userSession.create({
    data: {
      id: sessionId,
      userId: user.id,
      tokenHash,
      userAgent: req.get('user-agent') || null,
      ipAddress: req.ip || null,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });

  return token;
}
