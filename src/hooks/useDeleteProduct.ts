
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { deleteProduct } from '../services/products';

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id, token),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },
  });
}
