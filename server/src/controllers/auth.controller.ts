
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/database.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { setAuthCookie, clearAuthCookie } from "../utils/auth-cookie.js";
import { createUserSession } from "../utils/user-session.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function register(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration data.",
      errors: result.error.flatten(),
    });
  }

  const { name, email, password } = result.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists.",
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "STAFF",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const token = await createUserSession(req, user);

  setAuthCookie(res, token);

  return res.status(201).json({
    success: true,
    message: "Account created successfully.",
    user,
  });
}

export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid login data.",
      errors: result.error.flatten(),
    });
  }

  const { email, password, role } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  if (user.role !== role) {
    return res.status(403).json({
      success: false,
      message:
        role === "ADMIN"
          ? "You need to be promoted to be able to log in as an Admin."
          : "Your account is Admin. Please choose Admin to log in.",
    });
  }

  const token = await createUserSession(req, user);

  setAuthCookie(res, token);

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

export async function getCurrentUser(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve current user.",
    });
  }
}

export async function logout(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    await prisma.userSession.updateMany({
      where: {
        id: req.user!.sessionId,
        userId: req.user!.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
        loggedOutAt: new Date(),
      },
    });

    clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unable to log out. Please try again.",
    });
  }
}
