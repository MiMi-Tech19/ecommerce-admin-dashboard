import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getDashboardAnalytics } from '../services/analytics';

export function useDashboardAnalytics(period: number = 7) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['dashboard-analytics', period],
    queryFn: () => getDashboardAnalytics(token, period),
    enabled: Boolean(token),
  });
}