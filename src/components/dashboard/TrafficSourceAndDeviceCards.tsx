import {
  Filter,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';
import type {
  ActivePage,
  ConversionStep,
  DeviceBreakdown,
  TrafficSource,
} from '../../types';

interface TrafficSourceAndDeviceCardsProps {
  deviceBreakdown: DeviceBreakdown[];
  trafficSources: TrafficSource[];
  conversionFunnel: ConversionStep[];
  activePages?: ActivePage[];
}

function getDeviceIcon(device: string) {
  switch (device.toLowerCase()) {
    case 'mobile':
      return <Smartphone size={18} className="text-blue-600" />;
    case 'desktop':
      return <Monitor size={18} className="text-slate-700" />;
    case 'tablet':
      return <Tablet size={18} className="text-purple-600" />;
    default:
      return <Monitor size={18} className="text-slate-600" />;
  }
}

export function TrafficSourceAndDeviceCards({
  deviceBreakdown,
  trafficSources,
  conversionFunnel,
  activePages = [],
}: TrafficSourceAndDeviceCardsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* 1. Device Breakdown Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Device Breakdown</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Visitor sessions by device type
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
            <Monitor size={18} />
          </div>
        </div>

        <div className="space-y-4">
          {deviceBreakdown.map((item) => (
            <div key={item.device} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getDeviceIcon(item.device)}
                  <span className="font-medium text-slate-700">
                    {item.device}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">
                    {item.count.toLocaleString()} visits
                  </span>
                  <span className="font-semibold text-slate-900">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Real-time active pages snapshot inside same column */}
        {activePages.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Live Shopper Activity
              </h4>
            </div>
            <div className="space-y-2.5">
              {activePages.slice(0, 3).map((page) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between text-xs"
                >
                  <span
                    className="truncate max-w-[180px] text-slate-700"
                    title={page.title}
                  >
                    {page.title}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                    {page.activeVisitors} live
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Traffic Acquisition Sources */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Traffic Sources</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Where your store visitors originate
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
            <Globe size={18} />
          </div>
        </div>

        <div className="space-y-4">
          {trafficSources.map((source) => (
            <div key={source.source} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  {source.source}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">
                    {source.visitors.toLocaleString()}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {source.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${source.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Conversion Funnel */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Conversion Funnel</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Shopper progression from visit to purchase
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
            <Filter size={18} />
          </div>
        </div>

        <div className="space-y-3.5">
          {conversionFunnel.map((step, idx) => {
            const stepWidth = Math.max(12, step.percentage);

            return (
              <div key={step.step} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    {idx + 1}. {step.step}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {step.count.toLocaleString()} ({step.percentage}%)
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-md bg-slate-100">
                  <div
                    className={`h-full rounded-md transition-all ${
                      idx === 0
                        ? 'bg-slate-800'
                        : idx === 1
                        ? 'bg-blue-600'
                        : idx === 2
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${stepWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-lg bg-emerald-50/70 p-3 text-xs text-emerald-900">
          <p className="font-medium">Overall Conversion Rate: {conversionFunnel[conversionFunnel.length - 1]?.percentage ?? 3.8}%</p>
          <p className="mt-0.5 text-emerald-700">
            Average industry benchmark for ecommerce stores is 2.5% – 3.5%.
          </p>
        </div>
      </div>
    </div>
  );
}
