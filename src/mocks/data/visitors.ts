import type {
  ActivePage,
  ConversionStep,
  DeviceBreakdown,
  RealtimeVisitorStats,
  TrafficSource,
  VisitorAnalytics,
  VisitorMetric,
} from '../../types';

export function generateVisitorAnalytics(period: number = 7): VisitorAnalytics {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - (period - 1));

  const trafficOverTime: VisitorMetric[] = [];
  let totalVisitors = 0;
  let totalUnique = 0;
  let totalPageViews = 0;

  // Realistic daily pattern with weekend bumps
  for (let i = 0; i < period; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Base visitors roughly 650 - 1100 per day
    const baseMultiplier = isWeekend ? 1.25 : 1.0;
    const dailyVisitors = Math.floor((720 + ((i * 37) % 310)) * baseMultiplier);
    const uniqueVisitors = Math.floor(dailyVisitors * (0.68 + (((i * 11) % 15) / 100)));
    const pageViews = Math.floor(dailyVisitors * (2.8 + (((i * 7) % 12) / 10)));

    totalVisitors += dailyVisitors;
    totalUnique += uniqueVisitors;
    totalPageViews += pageViews;

    trafficOverTime.push({
      date: d.toISOString().slice(0, 10),
      visitors: dailyVisitors,
      uniqueVisitors,
      pageViews,
    });
  }

  const deviceBreakdown: DeviceBreakdown[] = [
    {
      device: 'Mobile',
      percentage: 58,
      count: Math.round(totalVisitors * 0.58),
    },
    {
      device: 'Desktop',
      percentage: 34,
      count: Math.round(totalVisitors * 0.34),
    },
    {
      device: 'Tablet',
      percentage: 8,
      count: Math.round(totalVisitors * 0.08),
    },
  ];

  const trafficSources: TrafficSource[] = [
    {
      source: 'Organic Search',
      percentage: 42,
      visitors: Math.round(totalVisitors * 0.42),
    },
    {
      source: 'Direct',
      percentage: 26,
      visitors: Math.round(totalVisitors * 0.26),
    },
    {
      source: 'Social Media',
      percentage: 18,
      visitors: Math.round(totalVisitors * 0.18),
    },
    {
      source: 'Referral & Affiliates',
      percentage: 9,
      visitors: Math.round(totalVisitors * 0.09),
    },
    {
      source: 'Email Campaigns',
      percentage: 5,
      visitors: Math.round(totalVisitors * 0.05),
    },
  ];

  const conversionFunnel: ConversionStep[] = [
    {
      step: 'Total Store Visitors',
      count: totalVisitors,
      percentage: 100,
    },
    {
      step: 'Product Views',
      count: Math.round(totalVisitors * 0.64),
      percentage: 64,
    },
    {
      step: 'Added to Cart',
      count: Math.round(totalVisitors * 0.18),
      percentage: 18,
    },
    {
      step: 'Completed Checkout',
      count: Math.round(totalVisitors * 0.038),
      percentage: 3.8,
    },
  ];

  return {
    period,
    totalVisitors,
    uniqueVisitors: totalUnique,
    totalPageViews,
    averageSessionDuration: '3m 42s',
    bounceRate: 38.4,
    conversionRate: 3.8,
    trafficOverTime,
    deviceBreakdown,
    trafficSources,
    conversionFunnel,
  };
}

export function getMockRealtimeVisitors(): RealtimeVisitorStats {
  // Slight fluctuation between 38 and 54 active users
  const now = new Date();
  const seconds = now.getSeconds();
  const wave = Math.sin(seconds / 10) * 8;
  const activeVisitorsNow = Math.max(25, Math.round(44 + wave));

  const activePages: ActivePage[] = [
    {
      path: '/products/premium-wireless-headphones',
      title: 'Premium Wireless Headphones',
      activeVisitors: Math.max(4, Math.round(activeVisitorsNow * 0.32)),
    },
    {
      path: '/',
      title: 'Storefront Homepage',
      activeVisitors: Math.max(3, Math.round(activeVisitorsNow * 0.28)),
    },
    {
      path: '/cart',
      title: 'Shopping Cart',
      activeVisitors: Math.max(2, Math.round(activeVisitorsNow * 0.18)),
    },
    {
      path: '/checkout',
      title: 'Secure Checkout',
      activeVisitors: Math.max(1, Math.round(activeVisitorsNow * 0.12)),
    },
    {
      path: '/products/leather-weekend-bag',
      title: 'Leather Weekend Bag',
      activeVisitors: Math.max(1, Math.round(activeVisitorsNow * 0.1)),
    },
  ];

  return {
    activeVisitorsNow,
    lastUpdated: now.toISOString(),
    activePages,
  };
}
