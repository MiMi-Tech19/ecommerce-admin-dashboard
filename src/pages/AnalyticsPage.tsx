import { useMemo } from "react";
import { useDashboardAnalytics } from "../hooks/useDashboardAnalytics";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function AnalyticsPage() {
  const { data, isLoading, isError } = useDashboardAnalytics();

  const maxRevenue = useMemo(() => {
    if (!data) {
      return 0;
    }

    return Math.max(...data.salesOverTime.map((metric) => metric.revenue), 1);
  }, [data]);

  const maxCategoryRevenue = useMemo(() => {
    if (!data) {
      return 0;
    }

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
            {data.conversionRate}%
          </p>
        </div>
      </div>

      {/* Sales overview */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Sales Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Revenue and orders over the last 7 days.
          </p>
        </div>

        <div className="space-y-5">
          {data.salesOverTime.map((metric) => {
            const revenuePercentage = (metric.revenue / maxRevenue) * 100;

            return (
              <div
                key={metric.date}
                className="grid grid-cols-[48px_1fr_100px] items-center gap-3"
              >
                <span className="text-sm font-medium text-slate-600">
                  {metric.date}
                </span>

                <div>
                  <div
                    className="h-8 rounded-md bg-slate-100 dark:!bg-slate-800"
                    role="img"
                    aria-label={`${metric.date}: ${formatCurrency(
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
