
import { z } from 'zod';

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(1, 'Customer name is required'),
    email: z.string().trim().email('A valid customer email is required'),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1, 'Product ID is required'),
        quantity: z.number().int().positive('Quantity must be greater than zero'),
      }),
    )
    .min(1, 'An order must contain at least one product'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
