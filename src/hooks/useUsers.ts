import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../services/users';

export function useUsers() {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(token),
    enabled: Boolean(token && user?.role === 'ADMIN'),
  });
}