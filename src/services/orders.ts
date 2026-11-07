
import type { Order, OrderStatus } from '../types';
import { apiFetch } from './api';

const ORDERS_ENDPOINT = '/api/orders';

export async function getOrders(): Promise<Order[]> {
  const response = await apiFetch(ORDERS_ENDPOINT);

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json() as Promise<Order[]>;
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

  if (!response.ok) {
    let message = 'Unable to update order status. Please try again.';

    try {
      const data = (await response.json()) as { message?: string };
      message = data.message || message;
    } catch {
      // Keep the fallback message if the response isn't valid JSON.
    }

    throw new Error(message);
  }

  return response.json() as Promise<Order>;
}
