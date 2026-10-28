
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { NotFoundPage } from '../pages/NotFoundPage';

const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
);

const ProductsPage = lazy(() =>
  import('../pages/ProductsPage').then((module) => ({
    default: module.ProductsPage,
  })),
);

const OrdersPage = lazy(() =>
  import('../pages/OrdersPage').then((module) => ({
    default: module.OrdersPage,
  })),
);

const AnalyticsPage = lazy(() =>
  import('../pages/AnalyticsPage').then((module) => ({
    default: module.AnalyticsPage,
  })),
);

const SettingsPage = lazy(() =>
  import('../pages/SettingsPage').then((module) => ({
    default: module.SettingsPage,
  })),
);

function PageLoading() {
  return (
    <div
      className="flex min-h-40 items-center justify-center"
      role="status"
      aria-live="polite"
    >
      Loading page...
    </div>
  );
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      errorElement: <NotFoundPage />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<PageLoading />}>
              <DashboardPage />
            </Suspense>
          ),
        },
        {
          path: 'products',
          element: (
            <Suspense fallback={<PageLoading />}>
              <ProductsPage />
            </Suspense>
          ),
        },
        {
          path: 'orders',
          element: (
            <Suspense fallback={<PageLoading />}>
              <OrdersPage />
            </Suspense>
          ),
        },
        {
          path: 'analytics',
          element: (
            <Suspense fallback={<PageLoading />}>
              <AnalyticsPage />
            </Suspense>
          ),
        },
        {
          path: 'settings',
          element: (
            <Suspense fallback={<PageLoading />}>
              <SettingsPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
