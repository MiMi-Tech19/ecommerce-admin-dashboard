
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { updateOrderStatus } from '../services/orders';
import type { OrderStatus } from '../types';

interface UpdateOrderStatusVariables {
  id: string;
  status: OrderStatus;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: ({ id, status }: UpdateOrderStatusVariables) =>
      updateOrderStatus(id, status, token),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['orders'],
      });
    },
  });
}
