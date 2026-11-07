import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getSessionHistory } from '../services/sessions';

export function useSessionHistory() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['sessionHistory'],
    queryFn: getSessionHistory,
    enabled: isAuthenticated,
  });
}