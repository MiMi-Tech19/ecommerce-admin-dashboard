import type { DashboardAnalytics } from '../types';
import { apiFetch, parseJsonResponse } from './api';

const DASHBOARD_ANALYTICS_ENDPOINT = '/api/analytics/dashboard';

export async function getDashboardAnalytics(
  period: number = 7,
): Promise<DashboardAnalytics> {
  const response = await apiFetch(
    `${DASHBOARD_ANALYTICS_ENDPOINT}?period=${period}`,
  );

  return parseJsonResponse<DashboardAnalytics>(
    response,
    'Failed to fetch dashboard analytics',
  );
}
