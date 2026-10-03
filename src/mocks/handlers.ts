import { http, HttpResponse } from 'msw';
import { dashboardAnalytics } from './data/analytics';
import { orders } from './data/orders';
import { products } from './data/products';

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json(products);
  }),

  http.get('/api/analytics/dashboard', () => {
    return HttpResponse.json(dashboardAnalytics);
  }),

  http.get('/api/orders', () => {
    return HttpResponse.json(orders);
  }),
];