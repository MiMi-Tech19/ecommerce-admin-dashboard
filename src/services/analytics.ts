import type { DashboardAnalytics } from '../types';

const DASHBOARD_ANALYTICS_ENDPOINT = '/api/analytics/dashboard';

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const response = await fetch(DASHBOARD_ANALYTICS_ENDPOINT);

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard analytics');
  }

  return response.json() as Promise<DashboardAnalytics>;
}