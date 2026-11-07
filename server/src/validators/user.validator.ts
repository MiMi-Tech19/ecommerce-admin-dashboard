import { z } from 'zod';

export const updateUserRoleSchema = z.object({
  role: z.enum(['ADMIN', 'STAFF']),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name cannot exceed 100 characters.'),
});

export type UpdateUserRoleInput = z.infer<
  typeof updateUserRoleSchema
>;

export type UpdateProfileInput = z.infer<
  typeof updateProfileSchema
>;