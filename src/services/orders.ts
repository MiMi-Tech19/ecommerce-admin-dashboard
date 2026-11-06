
import type { Order, OrderStatus } from '../types';
import { apiFetch } from './api';

const ORDERS_ENDPOINT = '/api/orders';

export async function getOrders(
  token: string | null = null,
): Promise<Order[]> {
  const response = await apiFetch(ORDERS_ENDPOINT, token);

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json() as Promise<Order[]>;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  token: string | null = null,
): Promise<Order> {
  const response = await apiFetch(
    `${ORDERS_ENDPOINT}/${encodeURIComponent(id)}/status`,
    token,
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
