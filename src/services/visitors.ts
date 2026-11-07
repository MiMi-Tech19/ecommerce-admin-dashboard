import type { RealtimeVisitorStats, VisitorAnalytics } from '../types';
import { apiFetch, parseJsonResponse } from './api';

const VISITORS_ANALYTICS_ENDPOINT = '/api/analytics/visitors';
const REALTIME_VISITORS_ENDPOINT = '/api/analytics/visitors/realtime';

export async function getVisitorAnalytics(
  period: number = 7,
): Promise<VisitorAnalytics> {
  const response = await apiFetch(
    `${VISITORS_ANALYTICS_ENDPOINT}?period=${period}`,
  );

  return parseJsonResponse<VisitorAnalytics>(
    response,
    'Failed to fetch visitor analytics',
  );
}

export async function getRealtimeVisitors(): Promise<RealtimeVisitorStats> {
  const response = await apiFetch(REALTIME_VISITORS_ENDPOINT);

  return parseJsonResponse<RealtimeVisitorStats>(
    response,
    'Failed to fetch realtime visitor stats',
  );
}
