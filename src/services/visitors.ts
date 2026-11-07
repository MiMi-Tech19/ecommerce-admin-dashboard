import type { RealtimeVisitorStats, VisitorAnalytics } from '../types';
import { apiFetch } from './api';

const VISITORS_ANALYTICS_ENDPOINT = '/api/analytics/visitors';
const REALTIME_VISITORS_ENDPOINT = '/api/analytics/visitors/realtime';

export async function getVisitorAnalytics(
  period: number = 7,
): Promise<VisitorAnalytics> {
  const response = await apiFetch(
    `${VISITORS_ANALYTICS_ENDPOINT}?period=${period}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch visitor analytics');
  }

  return response.json() as Promise<VisitorAnalytics>;
}

export async function getRealtimeVisitors(): Promise<RealtimeVisitorStats> {
  const response = await apiFetch(REALTIME_VISITORS_ENDPOINT);

  if (!response.ok) {
    throw new Error('Failed to fetch realtime visitor stats');
  }

  return response.json() as Promise<RealtimeVisitorStats>;
}
