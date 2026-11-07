
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
  description: z.string().trim().min(1, 'Description is required'),
  category: z.string().trim().min(1, 'Category is required'),
  price: z.number().positive('Price must be greater than zero'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  status: z.enum(['active', 'draft', 'archived']),
  imageUrl: z.string().trim().url('A valid image URL is required'),
});

export const updateProductSchema = createProductSchema;

export type CreateProductInput = z.infer<typeof createProductSchema>;
