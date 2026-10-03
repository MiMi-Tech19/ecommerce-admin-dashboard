import { useQuery } from '@tanstack/react-query';
import { getDashboardAnalytics } from '../services/analytics';

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: getDashboardAnalytics,
  });
}