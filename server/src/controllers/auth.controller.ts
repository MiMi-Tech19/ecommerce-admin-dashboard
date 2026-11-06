import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/database.js";
import jwt, { type SignOptions } from "jsonwebtoken";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { jwtExpiresIn } from "../config/auth.config.js";
import { setAuthCookie, clearAuthCookie } from "../utils/auth-cookie.js";

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

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      success: false,
      message: "Authentication service is not configured.",
    });
  }

  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

  const tokenOptions: SignOptions = {
    expiresIn: jwtExpiresIn as SignOptions["expiresIn"],
    subject: user.id,
  };

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    jwtSecret,
    tokenOptions,
  );
  setAuthCookie(res, token);
  return res.status(201).json({
    success: true,
    message: "Account created successfully.",
    token,
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

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  const tokenOptions: SignOptions = {
    expiresIn: jwtExpiresIn,
    subject: user.id,
  };

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    jwtSecret,
    tokenOptions,
  );
  setAuthCookie(res, token);
  return res.status(200).json({
    success: true,
    message: "Login successful.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

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
        message: 'User account not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve current user.',
    });
  }
}

export function logout(_req: Request, res: Response) {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}