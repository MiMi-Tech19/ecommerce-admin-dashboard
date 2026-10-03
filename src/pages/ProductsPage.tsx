import {
  ChevronDown,
  Package,
  Plus,
  Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import type { ProductStatus } from '../types';

type StatusFilter = 'all' | ProductStatus;
type CategoryFilter = 'all' | string;

interface StatusBadgeProps {
  status: ProductStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<ProductStatus, string> = {
    active: 'bg-emerald-50 text-emerald-700',
    draft: 'bg-amber-50 text-amber-700',
    archived: 'bg-slate-100 text-slate-600',
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

interface StockBadgeProps {
  stock: number;
}

function StockBadge({ stock }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <span className="font-medium text-red-600">
        Out of stock
      </span>
    );
  }

  if (stock <= 10) {
    return (
      <span className="font-medium text-amber-600">
        {stock} left
      </span>
    );
  }

  return (
    <span className="text-slate-600">
      {stock} in stock
    </span>
  );
}

export function ProductsPage() {
  const {
    data: products = [],
    isLoading,
    isError,
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>('all');

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.category)),
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' ||
        product.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'all' ||
        product.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    products,
    searchQuery,
    statusFilter,
    categoryFilter,
  ]);

  if (isLoading) {
    return (
      <section>
        <div className="mb-8">
          <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-5 w-64 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="h-96 animate-pulse rounded-xl bg-slate-200" />
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-900">
            Unable to load products
          </h1>

          <p className="mt-1 text-sm text-red-700">
            We couldn't retrieve the product list.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Catalog
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Products
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your store products and inventory.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Product Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Products
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {products.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Products
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {
              products.filter(
                (product) => product.status === 'active',
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">
            Low / Out of Stock
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {
              products.filter(
                (product) => product.stock <= 10,
              ).length
            }
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as StatusFilter,
                )
              }
              aria-label="Filter products by status"
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-600 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 sm:w-44"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              aria-label="Filter products by category"
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-600 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 sm:w-48"
            >
              <option value="all">All categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="font-semibold text-slate-900">
              Product Catalog
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredProducts.length} of{' '}
              {products.length} products
            </p>
          </div>

          <Package
            size={20}
            className="text-slate-400"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-10 text-center">
            <Package
              size={32}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-medium text-slate-900">
              No products found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Product
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Inventory
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {product.name}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                          {product.description}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {product.category}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      ${product.price.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <StockBadge stock={product.stock} />
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={product.status} />
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}