
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/products';

export function useProducts() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['products', token],
    queryFn: () => getProducts(token),
    enabled: Boolean(token),
  });
}
