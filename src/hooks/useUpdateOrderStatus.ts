
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus } from '../services/orders';
import type { OrderStatus } from '../types';

interface UpdateOrderStatusVariables {
  id: string;
  status: OrderStatus;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateOrderStatusVariables) =>
      updateOrderStatus(id, status),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['orders'],
      });
    },
  });
}
