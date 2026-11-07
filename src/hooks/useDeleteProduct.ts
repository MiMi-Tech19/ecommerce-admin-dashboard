
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProduct } from '../services/products';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },
  });
}
