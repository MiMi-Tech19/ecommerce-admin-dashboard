import {
  Clock3,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardAnalytics } from '../hooks/useDashboardAnalytics';
import { useOrders } from '../hooks/useOrders';
import { MetricCard } from '../components/dashboard/MetricCard';
import { StatusBadge } from '../components/dashboard/StatusBadge';


export function DashboardPage() {
  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
  } = useDashboardAnalytics();

  const {
    data: orders = [],
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useOrders();

  const isLoading = isAnalyticsLoading || isOrdersLoading;
  const isError = isAnalyticsError || isOrdersError;

  if (isLoading) {
    return (
      <section>
        <div className="mb-8">
          <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-5 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((card) => (
            <div
              key={card}
              className="h-36 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError || !analytics) {
    return (
      <section>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-900">
            Unable to load dashboard
          </h1>

          <p className="mt-1 text-sm text-red-700">
            We couldn't retrieve the dashboard analytics.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* Dashboard Heading */}
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          Overview
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Monitor your store performance and recent activity.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          change="+12.5%"
          positive
          icon={DollarSign}
        />

        <MetricCard
          title="Total Orders"
          value={analytics.totalOrders.toLocaleString()}
          change="+8.2%"
          positive
          icon={ShoppingCart}
        />

        <MetricCard
          title="Total Products"
          value={analytics.totalProducts.toLocaleString()}
          change="+4.3%"
          positive
          icon={Package}
        />

        <MetricCard
          title="Conversion Rate"
          value={`${analytics.conversionRate}%`}
          change="-1.2%"
          positive={false}
          icon={TrendingUp}
        />
      </div>

      {/* Analytics Section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Sales Overview */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Sales Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Revenue and orders over the last 7 days
              </p>
            </div>

            <select
              aria-label="Sales period"
              className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-slate-300"
              defaultValue="7"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          {/* Sales Chart */}
          <div className="mt-8 flex h-64 items-end gap-2 sm:gap-4">
            {analytics.salesOverTime.map((item) => {
              const maxRevenue = Math.max(
                ...analytics.salesOverTime.map(
                  (sale) => sale.revenue,
                ),
              );

              const height =
                maxRevenue > 0
                  ? (item.revenue / maxRevenue) * 100
                  : 0;

              return (
                <div
                  key={item.date}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div
                    className="rounded-t-md bg-slate-900 transition-all hover:bg-slate-700"
                    style={{ height: `${height}%` }}
                    title={`$${item.revenue.toLocaleString()} revenue`}
                  />

                  <span className="mt-2 text-center text-xs text-slate-400">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Sales by Category
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Revenue distribution
          </p>

          <div className="mt-6 space-y-5">
            {analytics.salesByCategory.map((item) => {
              const maxRevenue = Math.max(
                ...analytics.salesByCategory.map(
                  (category) => category.revenue,
                ),
              );

              const width =
                maxRevenue > 0
                  ? (item.revenue / maxRevenue) * 100
                  : 0;

              return (
                <div key={item.category}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {item.category}
                    </span>

                    <span className="text-slate-500">
                      ${item.revenue.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest customer orders and their status
            </p>
          </div>

          <Link
            to="/orders"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            View all orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Order
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Product
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const firstItem = order.items[0];

                return (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">
                        {order.id}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {order.customerName}
                        </p>

                        <p className="text-xs text-slate-500">
                          {order.customerEmail}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">
                        {firstItem?.productName ?? 'No product'}
                      </p>

                      {firstItem && (
                        <p className="text-xs text-slate-500">
                          Qty: {firstItem.quantity}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      ${order.total.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
<StatusBadge status={order.status} />                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Clock3 size={14} />
                        {new Date(
                          order.createdAt,
                        ).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}