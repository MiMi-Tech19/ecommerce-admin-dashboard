import { useMemo, useState } from 'react';
import type { VisitorMetric } from '../../types';

interface VisitorTrafficChartProps {
  trafficData: VisitorMetric[];
  period: number;
  onPeriodChange?: (period: number) => void;
}

export function VisitorTrafficChart({
  trafficData,
  period,
  onPeriodChange,
}: VisitorTrafficChartProps) {
  const [activeMetric, setActiveMetric] = useState<'both' | 'visitors' | 'pageViews'>('both');

  const maxVisitors = useMemo(() => {
    if (!trafficData.length) return 1;
    return Math.max(...trafficData.map((d) => d.visitors), 1);
  }, [trafficData]);

  const maxPageViews = useMemo(() => {
    if (!trafficData.length) return 1;
    return Math.max(...trafficData.map((d) => d.pageViews), 1);
  }, [trafficData]);

  const stats = useMemo(() => {
    if (!trafficData.length) {
      return { avgDaily: 0, peakDay: { date: 'N/A', visitors: 0 } };
    }
    const sum = trafficData.reduce((acc, curr) => acc + curr.visitors, 0);
    const avgDaily = Math.round(sum / trafficData.length);
    let peak = trafficData[0];
    for (const d of trafficData) {
      if (d.visitors > peak.visitors) {
        peak = d;
      }
    }
    const [year, month, day] = peak.date.split('-').map(Number);
    const peakDateLabel = new Date(year, month - 1, day).toLocaleDateString('en', {
      month: 'short',
      day: 'numeric',
    });
    return { avgDaily, peakDay: { date: peakDateLabel, visitors: peak.visitors } };
  }, [trafficData]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Visitor Traffic & Engagement
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Daily store visitors, unique sessions, and page view trends.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Filter Tabs */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveMetric('both')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                activeMetric === 'both'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Metrics
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('visitors')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                activeMetric === 'visitors'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visitors
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('pageViews')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                activeMetric === 'pageViews'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Page Views
            </button>
          </div>

          {/* Period selector if provided */}
          {onPeriodChange && (
            <select
              aria-label="Visitor traffic period"
              className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-slate-300"
              value={String(period)}
              onChange={(e) => onPeriodChange(Number(e.target.value))}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          )}
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="mb-6 flex flex-wrap gap-4 border-b border-slate-100 pb-4 text-xs">
        <div className="rounded-md bg-slate-50 px-3 py-1.5 text-slate-600">
          <span className="text-slate-400">Daily Average: </span>
          <strong className="font-semibold text-slate-900">
            {stats.avgDaily.toLocaleString()} visitors
          </strong>
        </div>
        <div className="rounded-md bg-slate-50 px-3 py-1.5 text-slate-600">
          <span className="text-slate-400">Peak Traffic: </span>
          <strong className="font-semibold text-slate-900">
            {stats.peakDay.visitors.toLocaleString()} ({stats.peakDay.date})
          </strong>
        </div>
        <div className="ml-auto flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-xs bg-slate-900" />
            <span className="text-slate-600">Visitors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-xs bg-blue-500" />
            <span className="text-slate-600">Unique</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-xs bg-emerald-500" />
            <span className="text-slate-600">Page Views</span>
          </div>
        </div>
      </div>

      {/* 7-Day Vertical Bar Chart Display */}
      {period === 7 ? (
        <div className="flex h-56 min-w-0 items-end gap-2 sm:h-64 sm:gap-5">
          {trafficData.map((item) => {
            const visitorHeight = (item.visitors / maxVisitors) * 100;
            const uniqueHeight = (item.uniqueVisitors / maxVisitors) * 100;
            const pageViewHeight = (item.pageViews / maxPageViews) * 100;

            const [year, month, day] = item.date.split('-').map(Number);
            const dateLabel = new Date(year, month - 1, day).toLocaleDateString(
              'en',
              { month: 'short', day: 'numeric' },
            );

            return (
              <div
                key={item.date}
                className="flex h-full min-w-0 flex-1 flex-col justify-end"
              >
                <div
                  className="flex h-full items-end justify-center gap-1"
                  title={`${dateLabel}: ${item.visitors.toLocaleString()} visitors (${item.uniqueVisitors.toLocaleString()} unique), ${item.pageViews.toLocaleString()} views`}
                >
                  {(activeMetric === 'both' || activeMetric === 'visitors') && (
                    <div
                      className="w-1/2 rounded-t-sm bg-slate-900 transition-all hover:bg-slate-700"
                      style={{ height: `${visitorHeight}%` }}
                    />
                  )}
                  {activeMetric === 'both' && (
                    <div
                      className="w-1/2 rounded-t-sm bg-blue-500 transition-all hover:bg-blue-400"
                      style={{ height: `${uniqueHeight}%` }}
                    />
                  )}
                  {activeMetric === 'pageViews' && (
                    <div
                      className="w-full rounded-t-sm bg-emerald-500 transition-all hover:bg-emerald-400"
                      style={{ height: `${pageViewHeight}%` }}
                    />
                  )}
                </div>
                <span className="mt-2 whitespace-nowrap text-center text-[11px] font-medium text-slate-500">
                  {dateLabel}
                </span>
                <span className="text-center text-[10px] text-slate-400">
                  {item.visitors.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        /* 30 or 90 Day Horizontal List Display */
        <div className="max-h-[420px] space-y-4 overflow-y-auto overscroll-contain pr-2">
          {trafficData.map((item) => {
            const percentage = (item.visitors / maxVisitors) * 100;
            const [year, month, day] = item.date.split('-').map(Number);
            const dateLabel = new Date(year, month - 1, day).toLocaleDateString(
              'en',
              { month: 'short', day: 'numeric' },
            );

            return (
              <div
                key={item.date}
                className="grid grid-cols-[65px_minmax(0,1fr)_120px] items-center gap-3"
              >
                <span className="text-xs font-medium text-slate-600 sm:text-sm">
                  {dateLabel}
                </span>
                <div className="h-6 rounded-md bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-md bg-slate-900 transition-all"
                    style={{ width: `${percentage}%` }}
                    title={`${dateLabel}: ${item.visitors} visitors`}
                  />
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-900 sm:text-sm">
                    {item.visitors.toLocaleString()} visits
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {item.pageViews.toLocaleString()} views
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
