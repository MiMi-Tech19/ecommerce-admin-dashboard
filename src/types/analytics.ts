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
  conversionRate: number | null;
  salesOverTime: SalesMetric[];
  salesByCategory: CategorySales[];
}

export interface VisitorMetric {
  date: string;
  visitors: number;
  uniqueVisitors: number;
  pageViews: number;
}

export interface DeviceBreakdown {
  device: 'Desktop' | 'Mobile' | 'Tablet';
  count: number;
  percentage: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

export interface ActivePage {
  path: string;
  title: string;
  activeVisitors: number;
}

export interface RealtimeVisitorStats {
  activeVisitorsNow: number;
  lastUpdated: string;
  activePages: ActivePage[];
}

export interface ConversionStep {
  step: string;
  count: number;
  percentage: number;
}

export interface VisitorAnalytics {
  period: number;
  totalVisitors: number;
  uniqueVisitors: number;
  totalPageViews: number;
  averageSessionDuration: string;
  bounceRate: number;
  conversionRate: number;
  trafficOverTime: VisitorMetric[];
  deviceBreakdown: DeviceBreakdown[];
  trafficSources: TrafficSource[];
  conversionFunnel: ConversionStep[];
}