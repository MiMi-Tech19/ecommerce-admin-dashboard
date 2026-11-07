import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRealtimeVisitors, getVisitorAnalytics } from './visitors';
import type { RealtimeVisitorStats, VisitorAnalytics } from '../types';

describe('visitors service', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getVisitorAnalytics', () => {
    it('returns visitor analytics when the request succeeds', async () => {
      const mockData = {
        period: 7,
        totalVisitors: 5400,
        uniqueVisitors: 3800,
        conversionRate: 3.8,
      } as VisitorAnalytics;

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      });

      vi.stubGlobal('fetch', fetchMock);

      await expect(getVisitorAnalytics(7)).resolves.toEqual(mockData);
      expect(fetchMock).toHaveBeenCalledOnce();

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe('/api/analytics/visitors?period=7');
      expect(options.credentials).toBe('include');
    });

    it('throws an error when the request fails', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
      });

      vi.stubGlobal('fetch', fetchMock);

      await expect(getVisitorAnalytics(7)).rejects.toThrow(
        'Failed to fetch visitor analytics',
      );
    });
  });

  describe('getRealtimeVisitors', () => {
    it('returns realtime visitor stats when the request succeeds', async () => {
      const mockRealtime = {
        activeVisitorsNow: 46,
        lastUpdated: new Date().toISOString(),
        activePages: [],
      } as RealtimeVisitorStats;

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockRealtime),
      });

      vi.stubGlobal('fetch', fetchMock);

      await expect(getRealtimeVisitors()).resolves.toEqual(mockRealtime);
      expect(fetchMock).toHaveBeenCalledOnce();

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe('/api/analytics/visitors/realtime');
      expect(options.credentials).toBe('include');
    });

    it('throws an error when the request fails', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
      });

      vi.stubGlobal('fetch', fetchMock);

      await expect(getRealtimeVisitors()).rejects.toThrow(
        'Failed to fetch realtime visitor stats',
      );
    });
  });
});
