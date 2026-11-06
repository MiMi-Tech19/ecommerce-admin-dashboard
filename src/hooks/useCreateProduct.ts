
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { createProduct } from '../services/products';
import type { Product } from '../types';

type NewProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (product: NewProduct) => createProduct(product, token),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },
  });
}
