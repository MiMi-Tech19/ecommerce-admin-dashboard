import { useMemo, useState } from "react";
import { useDashboardAnalytics } from "../hooks/useDashboardAnalytics";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState(7);

  const { data, isLoading, isError } = useDashboardAnalytics(period);

  const maxRevenue = useMemo(() => {
    if (!data) return 0;

    return Math.max(...data.salesOverTime.map((metric) => metric.revenue), 1);
  }, [data]);

  const maxCategoryRevenue = useMemo(() => {
    if (!data) return 0;

    return Math.max(
      ...data.salesByCategory.map((category) => category.revenue),
      1,
    );
  }, [data]);

  if (isLoading) {
    return (
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-2 text-slate-600">Loading analytics...</p>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-2 text-red-600">
          Unable to load analytics. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Reports</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-2 text-slate-600">
          View sales and business analytics.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(data.totalRevenue)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Orders</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {data.totalOrders.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Products</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {data.totalProducts.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Conversion Rate</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {data.conversionRate === null ? "N/A" : `${data.conversionRate}%`}
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
          {data.salesOverTime.map((metric) => {
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
          {data.salesByCategory.map((category) => {
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
    </section>
  );
}
