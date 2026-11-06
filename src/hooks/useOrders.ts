
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../services/orders';

export function useOrders() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['orders', token],
    queryFn: () => getOrders(token),
    enabled: Boolean(token),
  });
}
