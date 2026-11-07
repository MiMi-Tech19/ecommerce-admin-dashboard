import type { Response } from 'express';
import { prisma } from '../config/database.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export async function getAllUserSessions(
  _req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const sessions = await prisma.userSession.findMany({
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        lastActive: true,
        expiresAt: true,
        revokedAt: true,
        loggedOutAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    const now = new Date();

    const data = sessions.map((session) => ({
      ...session,
      isActive:
        session.revokedAt === null &&
        session.expiresAt > now,
    }));

    return res.status(200).json({
      success: true,
      data,
      total: data.length,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve session activity.',
    });
  }
}