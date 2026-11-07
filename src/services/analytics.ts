
import type { DashboardAnalytics } from '../types';
import { apiFetch } from './api';

const DASHBOARD_ANALYTICS_ENDPOINT = '/api/analytics/dashboard';

export async function getDashboardAnalytics(
  period: number = 7,
): Promise<DashboardAnalytics> {
  const response = await apiFetch(
    `${DASHBOARD_ANALYTICS_ENDPOINT}?period=${period}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard analytics');
  }

  return response.json() as Promise<DashboardAnalytics>;
}
