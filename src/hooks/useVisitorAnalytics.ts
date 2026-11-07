import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import {
  getRealtimeVisitors,
  getVisitorAnalytics,
} from '../services/visitors';

export function useVisitorAnalytics(period: number = 7) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['visitor-analytics', period],
    queryFn: () => getVisitorAnalytics(period),
    enabled: isAuthenticated,
  });
}

export function useRealtimeVisitors() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['realtime-visitors'],
    queryFn: getRealtimeVisitors,
    enabled: isAuthenticated,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });
}
