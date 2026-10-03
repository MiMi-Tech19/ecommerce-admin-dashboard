import type { DashboardAnalytics } from '../../types';

export const dashboardAnalytics: DashboardAnalytics = {
  totalRevenue: 24850.75,
  totalOrders: 342,
  totalProducts: 128,
  conversionRate: 4.8,

  salesOverTime: [
    { date: 'Mon', revenue: 3200, orders: 42 },
    { date: 'Tue', revenue: 4100, orders: 51 },
    { date: 'Wed', revenue: 3650, orders: 47 },
    { date: 'Thu', revenue: 5200, orders: 68 },
    { date: 'Fri', revenue: 4800, orders: 61 },
    { date: 'Sat', revenue: 3900, orders: 43 },
    { date: 'Sun', revenue: 0, orders: 0 },
  ],

  salesByCategory: [
    { category: 'Electronics', revenue: 9800, orders: 112 },
    { category: 'Shoes', revenue: 6200, orders: 84 },
    { category: 'Clothing', revenue: 5100, orders: 76 },
    { category: 'Appliances', revenue: 3750, orders: 70 },
  ],
};