
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getOrders, updateOrderStatus } from './orders';
import type { Order, OrderStatus } from '../types';

describe('getOrders', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns orders when the request succeeds', async () => {
    const orders = [] as Order[];

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(orders),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(getOrders()).resolves.toEqual(orders);
    expect(fetchMock).toHaveBeenCalledWith('/api/orders');
  });

  it('throws an error when the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false }),
    );

    await expect(getOrders()).rejects.toThrow('Failed to fetch orders');
  });
});

describe('updateOrderStatus', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends the status update and returns the updated order', async () => {
    const status = 'shipped' as OrderStatus;
    const order = { id: 'order-1', status } as Order;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(order),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(updateOrderStatus('order-1', status)).resolves.toEqual(order);

    expect(fetchMock).toHaveBeenCalledWith('/api/orders/order-1/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  });

  it('encodes the order ID in the URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });

    vi.stubGlobal('fetch', fetchMock);

    await updateOrderStatus('order/1', 'shipped' as OrderStatus);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/orders/order%2F1/status',
      expect.any(Object),
    );
  });

  it('throws an error when the update fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false }),
    );

    await expect(
      updateOrderStatus('order-1', 'shipped' as OrderStatus),
    ).rejects.toThrow('Failed to update order status');
  });
});
