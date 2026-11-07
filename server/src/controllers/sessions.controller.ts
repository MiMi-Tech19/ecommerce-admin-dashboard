import type { Response } from 'express';
import { prisma } from '../config/database.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export async function getActiveSessions(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const sessions = await prisma.userSession.findMany({
      where: {
        userId: req.user!.userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        lastActive: true,
        expiresAt: true,
      },
      orderBy: {
        lastActive: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      data: sessions.map((session) => ({
        ...session,
        isCurrent: session.id === req.user!.sessionId,
      })),
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve active sessions.',
    });
  }
}

export async function getSessionHistory(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const sessions = await prisma.userSession.findMany({
      where: {
        userId: req.user!.userId,
      },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        lastActive: true,
        expiresAt: true,
        revokedAt: true,
        loggedOutAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve session history.',
    });
  }
}

export async function revokeSession(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (typeof id !== 'string' || !id.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A valid session ID is required.',
      });
    }

    if (id === req.user!.sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Use the logout option to end your current session.',
      });
    }

    const result = await prisma.userSession.updateMany({
      where: {
        id,
        userId: req.user!.userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        revokedAt: new Date(),
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Active session not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Session terminated successfully.',
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Unable to terminate session.',
    });
  }
}