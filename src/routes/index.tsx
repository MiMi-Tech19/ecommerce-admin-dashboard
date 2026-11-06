import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  useLocation,
} from 'react-router-dom';import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../layouts/AppLayout";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RegisterPage } from "../pages/RegisterPage";

const UsersPage = lazy(() =>
  import("../pages/UsersPage").then((module) => ({
    default: module.UsersPage,
  })),
);

const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);

const ProductsPage = lazy(() =>
  import("../pages/ProductsPage").then((module) => ({
    default: module.ProductsPage,
  })),
);

const OrdersPage = lazy(() =>
  import("../pages/OrdersPage").then((module) => ({
    default: module.OrdersPage,
  })),
);

const AnalyticsPage = lazy(() =>
  import("../pages/AnalyticsPage").then((module) => ({
    default: module.AnalyticsPage,
  })),
);

const SettingsPage = lazy(() =>
  import("../pages/SettingsPage").then((module) => ({
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

function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === '/users' && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <AppLayout />;
}

export const routeConfig = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
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
        path: "products",
        element: (
          <Suspense fallback={<PageLoading />}>
            <ProductsPage />
          </Suspense>
        ),
      },
      {
        path: "orders",
        element: (
          <Suspense fallback={<PageLoading />}>
            <OrdersPage />
          </Suspense>
        ),
      },
      {
        path: "analytics",
        element: (
          <Suspense fallback={<PageLoading />}>
            <AnalyticsPage />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<PageLoading />}>
            <UsersPage />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<PageLoading />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routeConfig, {
  basename: import.meta.env.BASE_URL,
});
