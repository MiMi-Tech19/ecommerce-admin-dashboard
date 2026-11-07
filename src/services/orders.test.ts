import { afterEach, describe, expect, it, vi } from 'vitest';
import { getOrders, updateOrderStatus } from './orders';
import type { Order, OrderStatus } from '../types';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getOrders', () => {
  it('returns orders when the request succeeds', async () => {
    const orders = [] as Order[];

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(orders),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(getOrders()).resolves.toEqual(orders);

    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe('/api/orders');
    expect(options.credentials).toBe('include');
  });

  it('throws an error when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(getOrders()).rejects.toThrow('Failed to fetch orders');
  });
});

describe('updateOrderStatus', () => {
  it('sends the status update and returns the updated order', async () => {
    const status = 'shipped' as OrderStatus;
    const order = { id: 'order-1', status } as Order;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(order),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(updateOrderStatus('order-1', status)).resolves.toEqual(order);

    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe('/api/orders/order-1/status');
    expect(options).toEqual(
      expect.objectContaining({
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify({ status }),
      }),
    );

    expect(options.headers).toBeInstanceOf(Headers);
    expect(options.headers.get('Content-Type')).toBe('application/json');
  });

  it('encodes the order ID in the URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });

    vi.stubGlobal('fetch', fetchMock);

    await updateOrderStatus('order/1', 'shipped' as OrderStatus);

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe('/api/orders/order%2F1/status');
    expect(options.credentials).toBe('include');
  });

  it('throws an error when the update fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(
      updateOrderStatus('order-1', 'shipped' as OrderStatus),
    ).rejects.toThrow();
  });
});