import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getActiveSessions } from '../services/sessions';

export function useActiveSessions() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['activeSessions'],
    queryFn: getActiveSessions,
    enabled: isAuthenticated,
  });
}