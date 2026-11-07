
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../services/products';
import type { Product } from '../types';

type ProductUpdate = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

interface UpdateProductVariables {
  id: string;
  product: ProductUpdate;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: UpdateProductVariables) =>
      updateProduct(id, product),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },
  });
}
