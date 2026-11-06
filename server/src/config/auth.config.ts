import type { SignOptions } from 'jsonwebtoken';

const JWT_DURATION_PATTERN = /^\d+[smhd]$/;

const configuredExpiry = process.env.JWT_EXPIRES_IN?.trim() || '1d';

if (!JWT_DURATION_PATTERN.test(configuredExpiry)) {
  throw new Error(
    'Invalid JWT_EXPIRES_IN. Use a duration such as 15m, 1h, 1d, or 7d.',
  );
}

export const jwtExpiresIn =
  configuredExpiry as SignOptions['expiresIn'];