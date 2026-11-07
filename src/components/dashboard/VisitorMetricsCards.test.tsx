import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VisitorMetricsCards } from './VisitorMetricsCards';
import type { VisitorAnalytics } from '../../types';

describe('VisitorMetricsCards', () => {
  const mockAnalytics: VisitorAnalytics = {
    period: 7,
    totalVisitors: 8420,
    uniqueVisitors: 5690,
    totalPageViews: 24100,
    averageSessionDuration: '3m 45s',
    bounceRate: 36.5,
    conversionRate: 4.2,
    trafficOverTime: [],
    deviceBreakdown: [],
    trafficSources: [],
    conversionFunnel: [],
  };

  it('renders key visitor metrics correctly', () => {
    render(
      <VisitorMetricsCards
        analytics={mockAnalytics}
        realtimeStats={{
          activeVisitorsNow: 52,
          lastUpdated: new Date().toISOString(),
          activePages: [],
        }}
      />,
    );

    expect(screen.getByText('Live Now')).toBeInTheDocument();
    expect(screen.getByText('52')).toBeInTheDocument();
    expect(screen.getByText('8,420')).toBeInTheDocument();
    expect(screen.getByText('5,690')).toBeInTheDocument();
    expect(screen.getByText('24,100')).toBeInTheDocument();
    expect(screen.getByText('4.2%')).toBeInTheDocument();
    expect(screen.getByText('3m 45s')).toBeInTheDocument();
  });
});
