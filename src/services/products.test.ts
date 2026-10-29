
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from './products';
import type { Product } from '../types';

const sampleProduct = {
  name: 'Test Product',
  price: 25,
  stock: 10,
} as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getProducts', () => {
  it('returns products when the request succeeds', async () => {
    const products = [{ id: 'product-1', ...sampleProduct }] as Product[];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(products),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(getProducts()).resolves.toEqual(products);
    expect(fetchMock).toHaveBeenCalledWith('/api/products');
  });

  it('throws when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(getProducts()).rejects.toThrow('Failed to fetch products');
  });
});

describe('createProduct', () => {
  it('sends product data and returns the created product', async () => {
    const created = { id: 'product-1', ...sampleProduct } as Product;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(created),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(createProduct(sampleProduct)).resolves.toEqual(created);
    expect(fetchMock).toHaveBeenCalledWith('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleProduct),
    });
  });

  it('throws when creation fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(createProduct(sampleProduct)).rejects.toThrow(
      'Failed to create product',
    );
  });
});

describe('updateProduct', () => {
  it('sends updated product data and returns the updated product', async () => {
    const updated = { id: 'product-1', ...sampleProduct } as Product;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(updated),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(updateProduct('product-1', sampleProduct)).resolves.toEqual(
      updated,
    );

    expect(fetchMock).toHaveBeenCalledWith('/api/products/product-1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleProduct),
    });
  });

  it('throws when updating fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(
      updateProduct('product-1', sampleProduct),
    ).rejects.toThrow('Failed to update product');
  });
});

describe('deleteProduct', () => {
  it('deletes a product successfully', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await expect(deleteProduct('product-1')).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith('/api/products/product-1', {
      method: 'DELETE',
    });
  });

  it('throws when deletion fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(deleteProduct('product-1')).rejects.toThrow(
      'Failed to delete product',
    );
  });

  it('encodes the product ID in the URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await deleteProduct('product/1');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/products/product%2F1',
      { method: 'DELETE' },
    );
  });
});
