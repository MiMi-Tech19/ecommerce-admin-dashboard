import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { OrderStatus } from "../types";
import { useOrders } from "../hooks/useOrders";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";

const statusOptions: Array<"all" | OrderStatus> = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function formatStatus(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusClasses(status: OrderStatus): string {
  switch (status) {
    case "delivered":
      return "bg-emerald-100 text-emerald-700";
    case "shipped":
      return "bg-blue-100 text-blue-700";
    case "processing":
      return "bg-amber-100 text-amber-700";
    case "pending":
      return "bg-slate-100 text-slate-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function OrdersPage() {
  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  function clearUpdateError() {
    if (updateOrderStatus.isError) {
      updateOrderStatus.reset();
    }
  }

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.customerName.toLowerCase().includes(normalizedSearch) ||
        order.customerEmail.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "processing",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled",
  ).length;

  return (
    <section className="space-y-6" onClick={clearUpdateError}>
      {" "}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="mt-2 text-slate-600">
          Manage customer orders and order statuses.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Orders</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {orders.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pending</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {pendingOrders}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Processing</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {processingOrders}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Completed</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {completedOrders}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Cancelled</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {cancelledOrders}
          </p>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Order List</h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredOrders.length} of {orders.length} orders
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />

              <label htmlFor="order-search" className="sr-only">
                Search orders
              </label>

              <input
                id="order-search"
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  clearUpdateError();
                  setSearchTerm(event.target.value);
                }}
                placeholder="Search orders..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
              />
            </div>

            <div>
              <label htmlFor="order-status-filter" className="sr-only">
                Filter orders by status
              </label>

              <select
                id="order-status-filter"
                value={statusFilter}
                onChange={(event) => {
                  clearUpdateError();
                  setStatusFilter(event.target.value as "all" | OrderStatus);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-40"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === "all" ? "All statuses" : formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading orders...
          </div>
        )}

        {isError && (
          <div role="alert" className="p-8 text-center">
            <p className="text-sm text-red-600">
              Unable to load orders. Please try again.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isFetching ? "Retrying..." : "Retry"}
            </button>
          </div>
        )}

        {updateOrderStatus.isError && (
          <p role="alert" className="px-5 py-3 text-sm text-red-600">
            {updateOrderStatus.error instanceof Error
              ? updateOrderStatus.error.message
              : "Unable to update order status. Please try again."}
          </p>
        )}

        {!isLoading && !isError && filteredOrders.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500">
            No orders match your search or filter.
          </div>
        )}

        {!isLoading && !isError && filteredOrders.length > 0 && (
          <>
            {/* Mobile Order Cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredOrders.map((order) => (
                <article key={order.id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Order</p>
                      <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                        {order.id}
                      </p>
                    </div>

                    <select
                      aria-label={`Update status for order ${order.id}`}
                      value={order.status}
                      disabled={
                        updateOrderStatus.isPending &&
                        updateOrderStatus.variables?.id === order.id
                      }
                      onChange={(event) => {
                        const status = event.target.value as OrderStatus;
                        updateOrderStatus.reset();
                        updateOrderStatus.mutate({ id: order.id, status });
                      }}
                      className={`max-w-[150px] rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-wait disabled:opacity-60 ${getStatusClasses(order.status)}`}
                    >
                      {statusOptions
                        .filter((status) => status !== "all")
                        .map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Customer</p>
                      <p className="mt-1 break-words text-sm font-medium text-slate-900">
                        {order.customerName}
                      </p>
                      <p className="break-all text-xs text-slate-500">
                        {order.customerEmail}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Items</p>
                      <p className="mt-1 text-sm text-slate-900">
                        {order.items.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="mt-1 text-xs text-slate-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop Orders Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Order
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Customer
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Items
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Total
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {order.id}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {order.customerEmail}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {order.items.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        )}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-900">
                        ${order.total.toFixed(2)}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          aria-label={`Update status for order ${order.id}`}
                          value={order.status}
                          disabled={
                            updateOrderStatus.isPending &&
                            updateOrderStatus.variables?.id === order.id
                          }
                          onChange={(event) => {
                            const status = event.target.value as OrderStatus;
                            updateOrderStatus.reset();
                            updateOrderStatus.mutate({ id: order.id, status });
                          }}
                          className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-wait disabled:opacity-60 ${getStatusClasses(order.status)}`}
                        >
                          {statusOptions
                            .filter((status) => status !== "all")
                            .map((status) => (
                              <option key={status} value={status}>
                                {formatStatus(status)}
                              </option>
                            ))}
                        </select>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
