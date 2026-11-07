import {
  Clock3,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardAnalytics } from "../hooks/useDashboardAnalytics";
import { useOrders } from "../hooks/useOrders";
import {
  useRealtimeVisitors,
  useVisitorAnalytics,
} from "../hooks/useVisitorAnalytics";
import { MetricCard } from "../components/dashboard/MetricCard";
import { StatusBadge } from "../components/dashboard/StatusBadge";


function DashboardHeading({ liveVisitors }: { liveVisitors?: number }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">Overview</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor your store performance and real-time activity.
        </p>
      </div>

      {liveVisitors !== undefined && (
        <Link
          to="/analytics"
          className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
          title="Click to view detailed visitor analytics"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span>{liveVisitors} Live Visitors</span>
          <span className="text-emerald-600">→</span>
        </Link>
      )}
    </div>
  );
}


function AnalyticsSkeleton() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((card) => (
          <div key={card} className="h-36 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-xl bg-slate-200 lg:col-span-2" />
        <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </>
  );
}

function RecentOrders({
  orders,
}: {
  orders: ReturnType<typeof useOrders>["data"];
}) {
  const orderList = orders ?? [];

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Recent Orders</h2>
          <p className="mt-1 text-sm text-slate-500">Latest customer orders and their status</p>
        </div>
        <Link to="/orders" className="text-sm font-medium text-slate-700 hover:text-slate-900">
          View all orders →
        </Link>
      </div>

      {orderList.length === 0 ? (
        <p className="p-6 text-sm text-slate-500">No recent orders found.</p>
      ) : (
        <>
          <div className="divide-y divide-slate-100 md:hidden">
            {orderList.map((order) => {
              const firstItem = order.items[0];
              return (
                <article key={order.id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500">Order</p>
                      <p className="mt-1 break-all text-sm font-semibold text-slate-900">{order.id}</p>
                    </div>
                    <div className="shrink-0"><StatusBadge status={order.status} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Customer</p>
                      <p className="mt-1 break-words text-sm font-medium text-slate-900">{order.customerName}</p>
                      <p className="break-all text-xs text-slate-500">{order.customerEmail}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Product</p>
                      <p className="mt-1 break-words text-sm text-slate-700">{firstItem?.productName ?? "No product"}</p>
                      {firstItem && <p className="text-xs text-slate-500">Qty: {firstItem.quantity}</p>}
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                        <Clock3 size={13} />{new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Order</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Customer</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Product</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Total</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map((order) => {
                  const firstItem = order.items[0];
                  return (
                    <tr key={order.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-6 py-4"><span className="text-sm font-medium text-slate-900">{order.id}</span></td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{order.customerName}</p>
                          <p className="text-xs text-slate-500">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">{firstItem?.productName ?? "No product"}</p>
                        {firstItem && <p className="text-xs text-slate-500">Qty: {firstItem.quantity}</p>}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Clock3 size={14} />{new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export function DashboardPage() {
  const [period, setPeriod] = useState(7);
  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
  } = useDashboardAnalytics(period);
  const {
    data: orders = [],
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useOrders();
  const { data: realtimeVisitors } = useRealtimeVisitors();
  const { data: visitorAnalytics } = useVisitorAnalytics(period);

  const maxRevenue = Math.max(0, ...(analytics?.salesOverTime.map((sale) => sale.revenue) ?? []));
  const maxCategoryRevenue = Math.max(0, ...(analytics?.salesByCategory.map((category) => category.revenue) ?? []));

  return (
    <section>
      <DashboardHeading liveVisitors={realtimeVisitors?.activeVisitorsNow} />
      {isAnalyticsLoading ? (
        <AnalyticsSkeleton />
      ) : isAnalyticsError || !analytics ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">Unable to load dashboard</h2>
          <p className="mt-1 text-sm text-red-700">We couldn't retrieve the dashboard analytics.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard title="Total Revenue" value={`$${analytics.totalRevenue.toLocaleString()}`} icon={DollarSign} />
            <MetricCard title="Total Orders" value={analytics.totalOrders.toLocaleString()} icon={ShoppingCart} />
            <MetricCard title="Total Products" value={analytics.totalProducts.toLocaleString()} icon={Package} />
            <MetricCard
              title="Live Visitors"
              value={(realtimeVisitors?.activeVisitorsNow ?? 42).toLocaleString()}
              icon={Users}
            />
            <MetricCard
              title="Conversion Rate"
              value={
                analytics.conversionRate !== null
                  ? `${analytics.conversionRate}%`
                  : visitorAnalytics?.conversionRate
                  ? `${visitorAnalytics.conversionRate}%`
                  : "N/A"
              }
              icon={TrendingUp}
            />
          </div>


          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">Sales Overview</h2>
                  <p className="mt-1 text-sm text-slate-500">Revenue and orders over the last {period} days</p>
                </div>
                <select
                  aria-label="Sales period"
                  className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-slate-300"
                  value={String(period)}
                  onChange={(event) => setPeriod(Number(event.target.value))}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>

              <div className={period === 7 ? "mt-6 w-full min-w-0 sm:mt-8" : "mt-6 max-h-[420px] w-full min-w-0 overflow-y-auto overscroll-contain pr-2 sm:mt-8"}>
                {period === 7 ? (
                  <div className="flex h-56 min-w-0 items-end gap-1.5 sm:h-64 sm:gap-4">
                    {analytics.salesOverTime.map((item) => {
                      const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                      const [year, month, day] = item.date.split("-").map(Number);
                      const dateLabel = new Date(year, month - 1, day).toLocaleDateString("en", { month: "short", day: "numeric" });
                      return (
                        <div key={item.date} className="flex h-full min-w-0 flex-1 flex-col justify-end">
                          <div
                            className="rounded-t-md bg-slate-900 transition-all hover:bg-slate-700 dark:!bg-blue-500 dark:hover:!bg-blue-400"
                            style={{ height: `${height}%` }}
                            title={`${dateLabel}: $${item.revenue.toLocaleString()} revenue, ${item.orders} orders`}
                          />
                          <span className="mt-2 whitespace-nowrap text-center text-[11px] text-slate-400">{dateLabel}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {analytics.salesOverTime.map((item) => {
                      const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                      const [year, month, day] = item.date.split("-").map(Number);
                      const dateLabel = new Date(year, month - 1, day).toLocaleDateString("en", { month: "short", day: "numeric" });
                      return (
                        <div key={item.date} className="grid grid-cols-[55px_minmax(0,1fr)_85px] items-center gap-2 sm:grid-cols-[65px_minmax(0,1fr)_110px] sm:gap-3">
                          <span className="text-xs font-medium text-slate-600 sm:text-sm">{dateLabel}</span>
                          <div className="h-7 rounded-md bg-slate-100 dark:!bg-slate-800">
                            <div className="h-full rounded-md bg-slate-900 transition-all dark:!bg-blue-500" style={{ width: `${percentage}%` }} />
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-slate-900 sm:text-sm">${item.revenue.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-500 sm:text-xs">{item.orders} orders</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="font-semibold text-slate-900">Sales by Category</h2>
              <p className="mt-1 text-sm text-slate-500">Revenue distribution</p>
              <div className="mt-6 space-y-5">
                {analytics.salesByCategory.map((item) => {
                  const width = maxCategoryRevenue > 0 ? (item.revenue / maxCategoryRevenue) * 100 : 0;
                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="min-w-0 break-words font-medium text-slate-700">{item.category}</span>
                        <span className="shrink-0 text-slate-500">${item.revenue.toLocaleString()}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:!bg-slate-800">
                        <div className="h-full rounded-full bg-slate-900 dark:!bg-blue-500" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {isOrdersLoading ? (
        <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-200" />
      ) : isOrdersError ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">Unable to load recent orders</h2>
          <p className="mt-1 text-sm text-red-700">We couldn't retrieve recent orders.</p>
        </div>
      ) : (
        <RecentOrders orders={orders} />
      )}
    </section>
  );
}
