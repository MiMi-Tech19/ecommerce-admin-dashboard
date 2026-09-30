import type { Order } from '../types';

const ORDERS_ENDPOINT = '/api/orders';

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(ORDERS_ENDPOINT);

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json() as Promise<Order[]>;
}