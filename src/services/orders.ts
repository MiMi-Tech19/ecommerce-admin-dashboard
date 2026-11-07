import type { Order, OrderStatus } from '../types';
import { apiFetch, parseJsonResponse } from './api';

const ORDERS_ENDPOINT = '/api/orders';

export async function getOrders(): Promise<Order[]> {
  const response = await apiFetch(ORDERS_ENDPOINT);

  return parseJsonResponse<Order[]>(response, 'Failed to fetch orders');
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  const response = await apiFetch(
    `${ORDERS_ENDPOINT}/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    },
  );

  if (response.status === 403) {
    throw new Error('Only admins can update order status.');
  }

  return parseJsonResponse<Order>(
    response,
    'Unable to update order status. Please try again.',
  );
}
