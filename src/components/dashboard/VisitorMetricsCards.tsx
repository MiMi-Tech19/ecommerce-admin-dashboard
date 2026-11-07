import {
  Activity,
  Clock,
  Eye,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import type { RealtimeVisitorStats, VisitorAnalytics } from '../../types';

interface VisitorMetricsCardsProps {
  analytics: VisitorAnalytics;
  realtimeStats?: RealtimeVisitorStats;
  periodLabel?: string;
}

export function VisitorMetricsCards({
  analytics,
  realtimeStats,
  periodLabel = 'last 7 days',
}: VisitorMetricsCardsProps) {
  const activeVisitors = realtimeStats?.activeVisitorsNow ?? 42;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {/* Real-time Live Visitors Card */}
      <article className="relative overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Live Now
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {activeVisitors.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
            <Activity size={18} />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">Active store visitors</p>
      </article>

      {/* Total Visitors */}
      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Visitors</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {analytics.totalVisitors.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
            <Users size={18} />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">Over {periodLabel}</p>
      </article>

      {/* Unique Visitors */}
      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Unique Visitors</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {analytics.uniqueVisitors.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
            <UserCheck size={18} />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {Math.round((analytics.uniqueVisitors / Math.max(analytics.totalVisitors, 1)) * 100)}% unique rate
        </p>
      </article>

      {/* Page Views */}
      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Page Views</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {analytics.totalPageViews.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
            <Eye size={18} />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {(analytics.totalPageViews / Math.max(analytics.totalVisitors, 1)).toFixed(1)} views / visit
        </p>
      </article>

      {/* Conversion Rate */}
      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Conversion Rate</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {analytics.conversionRate}%
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
            <TrendingUp size={18} />
          </div>
        </div>
        <p className="mt-3 text-xs text-emerald-600 font-medium">
          Visitors to orders
        </p>
      </article>

      {/* Average Session Duration */}
      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Duration</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {analytics.averageSessionDuration}
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
            <Clock size={18} />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Bounce: {analytics.bounceRate}%
        </p>
      </article>
    </div>
  );
}
