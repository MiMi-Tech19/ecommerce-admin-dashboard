export interface SalesMetric {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategorySales {
  category: string;
  revenue: number;
  orders: number;
}

export interface DashboardAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  conversionRate: number;
  salesOverTime: SalesMetric[];
  salesByCategory: CategorySales[];
}