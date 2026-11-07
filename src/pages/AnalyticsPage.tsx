import { useMemo, useState } from "react";
import { useDashboardAnalytics } from "../hooks/useDashboardAnalytics";
import {
  useRealtimeVisitors,
  useVisitorAnalytics,
} from "../hooks/useVisitorAnalytics";
import { VisitorMetricsCards } from "../components/dashboard/VisitorMetricsCards";
import { VisitorTrafficChart } from "../components/dashboard/VisitorTrafficChart";
import { TrafficSourceAndDeviceCards } from "../components/dashboard/TrafficSourceAndDeviceCards";
import { BarChart3, Users } from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState(7);
  const [activeTab, setActiveTab] = useState<"visitors" | "sales">("visitors");

  const {
    data: salesData,
    isLoading: isSalesLoading,
    isError: isSalesError,
  } = useDashboardAnalytics(period);

  const {
    data: visitorData,
    isLoading: isVisitorLoading,
    isError: isVisitorError,
  } = useVisitorAnalytics(period);

  const { data: realtimeData } = useRealtimeVisitors();

  const maxRevenue = useMemo(() => {
    if (!salesData) return 0;
    return Math.max(...salesData.salesOverTime.map((metric) => metric.revenue), 1);
  }, [salesData]);

  const maxCategoryRevenue = useMemo(() => {
    if (!salesData) return 0;
    return Math.max(
      ...salesData.salesByCategory.map((category) => category.revenue),
      1,
    );
  }, [salesData]);


  return (
    <section className="space-y-6">
      {/* Page Header and Tab Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Reports & Insights</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {activeTab === "visitors"
              ? "Monitor real-time visitors, traffic acquisition, device distribution, and funnel conversions."
              : "Review sales performance, revenue breakdown, and order metrics."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab("visitors")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === "visitors"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users size={16} />
            <span>Visitor Analytics</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sales")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === "sales"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 size={16} />
            <span>Sales & Revenue</span>
          </button>
        </div>
      </div>

      {/* Visitor Analytics Tab View */}
      {activeTab === "visitors" && (
        <div className="space-y-6">
          {isVisitorLoading ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200" />
                ))}
              </div>
              <div className="h-72 animate-pulse rounded-xl bg-slate-200" />
              <div className="grid gap-6 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 animate-pulse rounded-xl bg-slate-200" />
                ))}
              </div>
            </div>
          ) : isVisitorError || !visitorData ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <h2 className="font-semibold text-red-900">
                Unable to load visitor analytics
              </h2>
              <p className="mt-1 text-sm text-red-700">
                We couldn't retrieve visitor metrics. Please try again later.
              </p>
            </div>
          ) : (
            <>
              {/* 1. Real-time and KPI Cards */}
              <VisitorMetricsCards
                analytics={visitorData}
                realtimeStats={realtimeData}
                periodLabel={`last ${period} days`}
              />

              {/* 2. Traffic Over Time Chart */}
              <VisitorTrafficChart
                trafficData={visitorData.trafficOverTime}
                period={period}
                onPeriodChange={setPeriod}
              />

              {/* 3. Devices, Traffic Channels, and Conversion Funnel */}
              <TrafficSourceAndDeviceCards
                deviceBreakdown={visitorData.deviceBreakdown}
                trafficSources={visitorData.trafficSources}
                conversionFunnel={visitorData.conversionFunnel}
                activePages={realtimeData?.activePages}
              />
            </>
          )}
        </div>
      )}

      {/* Sales & Revenue Tab View */}
      {activeTab === "sales" && (
        <div className="space-y-6">
          {isSalesLoading ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200" />
                ))}
              </div>
              <div className="h-72 animate-pulse rounded-xl bg-slate-200" />
              <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
            </div>
          ) : isSalesError || !salesData ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <h2 className="font-semibold text-red-900">
                Unable to load sales analytics
              </h2>
              <p className="mt-1 text-sm text-red-700">
                Please try again later.
              </p>
            </div>
          ) : (
            <>
              {/* Sales KPI cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {formatCurrency(salesData.totalRevenue)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Total Orders</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {salesData.totalOrders.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Total Products</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {salesData.totalProducts.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Conversion Rate</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {salesData.conversionRate !== null
                      ? `${salesData.conversionRate}%`
                      : visitorData?.conversionRate
                      ? `${visitorData.conversionRate}%`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Sales overview */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Sales Overview
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Revenue and orders over the last {period} days.
                    </p>
                  </div>

                  <select
                    aria-label="Analytics reporting period"
                    className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-slate-300"
                    value={String(period)}
                    onChange={(event) => setPeriod(Number(event.target.value))}
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </div>

                <div
                  className={
                    period === 7
                      ? "space-y-5"
                      : "max-h-[420px] space-y-5 overflow-y-auto overscroll-contain pr-2"
                  }
                >
                  {salesData.salesOverTime.map((metric) => {
                    const revenuePercentage = (metric.revenue / maxRevenue) * 100;

                    const [year, month, day] = metric.date.split("-").map(Number);
                    const dateLabel = new Date(year, month - 1, day).toLocaleDateString(
                      "en",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    );

                    return (
                      <div
                        key={metric.date}
                        className="grid grid-cols-[65px_minmax(0,1fr)_110px] items-center gap-3"
                      >
                        <span className="text-sm font-medium text-slate-600">
                          {dateLabel}
                        </span>

                        <div>
                          <div
                            className="h-8 rounded-md bg-slate-100 dark:!bg-slate-800"
                            role="img"
                            aria-label={`${dateLabel}: ${formatCurrency(
                              metric.revenue,
                            )} revenue`}
                          >
                            <div
                              className="h-full rounded-md bg-slate-900 transition-all dark:!bg-blue-500"
                              style={{ width: `${revenuePercentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">
                            {formatCurrency(metric.revenue)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {metric.orders} orders
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category performance */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Sales by Category
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Revenue performance across product categories.
                  </p>
                </div>

                <div className="space-y-6">
                  {salesData.salesByCategory.map((category) => {
                    const revenuePercentage =
                      (category.revenue / maxCategoryRevenue) * 100;

                    return (
                      <div key={category.category}>
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-slate-700">
                            {category.category}
                          </span>

                          <div className="text-right">
                            <span className="text-sm font-semibold text-slate-900">
                              {formatCurrency(category.revenue)}
                            </span>
                            <span className="ml-2 text-xs text-slate-500">
                              {category.orders} orders
                            </span>
                          </div>
                        </div>

                        <div
                          className="h-3 rounded-full bg-slate-100 dark:!bg-slate-800"
                          role="img"
                          aria-label={`${category.category}: ${formatCurrency(
                            category.revenue,
                          )} from ${category.orders} orders`}
                        >
                          <div
                            className="h-full rounded-full bg-slate-900 transition-all dark:!bg-blue-500"
                            style={{ width: `${revenuePercentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

