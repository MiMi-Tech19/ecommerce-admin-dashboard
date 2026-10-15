
import type { Order, OrderStatus } from '../types';

const ORDERS_ENDPOINT = '/api/orders';

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(ORDERS_ENDPOINT);

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json() as Promise<Order[]>;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  const response = await fetch(
    `${ORDERS_ENDPOINT}/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to update order status');
  }

  return response.json() as Promise<Order>;
}
