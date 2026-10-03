import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../services/orders';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });
}