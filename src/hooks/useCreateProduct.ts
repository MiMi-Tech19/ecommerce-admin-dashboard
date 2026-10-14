import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../services/products';
import type { Product } from '../types';

type NewProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: NewProduct) => createProduct(product),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },
  });
}