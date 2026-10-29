
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getDashboardAnalytics } from './analytics';
import type { DashboardAnalytics } from '../types';

describe('getDashboardAnalytics', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns analytics when the request succeeds', async () => {
    const analytics = {
      totalRevenue: 12500,
    } as DashboardAnalytics;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(analytics),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(getDashboardAnalytics()).resolves.toEqual(analytics);
    expect(fetchMock).toHaveBeenCalledWith('/api/analytics/dashboard');
  });

  it('throws an error when the request fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(getDashboardAnalytics()).rejects.toThrow(
      'Failed to fetch dashboard analytics',
    );
  });
});
