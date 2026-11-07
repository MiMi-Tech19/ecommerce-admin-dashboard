
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, Outlet } from 'react-router-dom';
import { routeConfig } from './index';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: true,
    user: {
      id: 'user-1',
      name: 'Test Admin',
      email: 'admin@example.com',
      role: 'ADMIN',
    },
    isInitializing: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  })),
}));

vi.mock('../layouts/AppLayout', () => ({
  AppLayout: () => (
    <div>
      <nav>Test navigation</nav>
      <Outlet />
    </div>
  ),
}));

vi.mock('../pages/NotFoundPage', () => ({
  NotFoundPage: () => <h1>Page not found</h1>,
}));

vi.mock('../pages/DashboardPage', () => ({
  DashboardPage: () => <h1>Dashboard page</h1>,
}));

vi.mock('../pages/ProductsPage', () => ({
  ProductsPage: () => <h1>Products page</h1>,
}));

vi.mock('../pages/OrdersPage', () => ({
  OrdersPage: () => <h1>Orders page</h1>,
}));

vi.mock('../pages/AnalyticsPage', () => ({
  AnalyticsPage: () => <h1>Analytics page</h1>,
}));

vi.mock('../pages/SettingsPage', () => ({
  SettingsPage: () => <h1>Settings page</h1>,
}));

describe('application routes', () => {
  it.each([
    ['/', 'Dashboard page'],
    ['/products', 'Products page'],
    ['/orders', 'Orders page'],
    ['/analytics', 'Analytics page'],
    ['/settings', 'Settings page'],
  ])('renders the actual configured route %s', async (path, heading) => {
    const testRouter = createMemoryRouter(routeConfig, {
      initialEntries: [path],
    });

    render(<RouterProvider router={testRouter} />);

    expect(
      await screen.findByRole('heading', { name: heading }),
    ).toBeInTheDocument();

    expect(screen.getByText('Test navigation')).toBeInTheDocument();
  });

  it('renders the not-found page for an unknown route', async () => {
    const testRouter = createMemoryRouter(routeConfig, {
      initialEntries: ['/unknown-route'],
    });

    render(<RouterProvider router={testRouter} />);

    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument();
  });
});
