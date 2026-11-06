
import type { Response } from 'express';
import { prisma } from '../config/database.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { updateUserRoleSchema } from '../validators/user.validator.js';

export async function getUsers(_req: AuthenticatedRequest, res: Response) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json({
    success: true,
    users,
  });
}

export async function updateUserRole(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.params.id;

  if (typeof userId !== 'string' || !userId.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID.',
    });
  }

  const result = updateUserRoleSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role data.',
      errors: result.error.flatten(),
    });
  }

  const { role } = result.data;

  try {
    const outcome = await prisma.$transaction(
      async (tx) => {
        const existingUser = await tx.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        });

        if (!existingUser) {
          return {
            status: 404,
            body: {
              success: false,
              message: 'User not found.',
            },
          };
        }

        if (
          existingUser.id === req.user?.userId &&
          existingUser.role === 'ADMIN' &&
          role !== 'ADMIN'
        ) {
          return {
            status: 400,
            body: {
              success: false,
              message: 'You cannot change your own administrator role.',
            },
          };
        }

        if (existingUser.role === role) {
          return {
            status: 200,
            body: {
              success: true,
              message: `User already has the ${role} role.`,
              user: existingUser,
            },
          };
        }

        if (existingUser.role === 'ADMIN' && role === 'STAFF') {
          const adminCount = await tx.user.count({
            where: { role: 'ADMIN' },
          });

          if (adminCount <= 1) {
            return {
              status: 409,
              body: {
                success: false,
                message: 'The last administrator cannot be demoted.',
              },
            };
          }
        }

        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: { role },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        });

        return {
          status: 200,
          body: {
            success: true,
            message: `User role updated to ${role} successfully.`,
            user: updatedUser,
          },
        };
      },
      {
        isolationLevel: 'Serializable',
      },
    );

    return res.status(outcome.status).json(outcome.body);
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2034'
    ) {
      return res.status(409).json({
        success: false,
        message: 'A concurrent role update occurred. Please try again.',
      });
    }

    throw error;
  }
}
