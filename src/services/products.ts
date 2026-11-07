import type { Product } from '../types';
import { apiFetch, parseJsonResponse } from './api';

const PRODUCTS_ENDPOINT = '/api/products';

export async function getProducts(): Promise<Product[]> {
  const response = await apiFetch(PRODUCTS_ENDPOINT);

  return parseJsonResponse<Product[]>(response, 'Failed to fetch products.');
}

export async function createProduct(
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Product> {
  const response = await apiFetch(PRODUCTS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(product),
  });

  return parseJsonResponse<Product>(response, 'Failed to create product.');
}

export async function updateProduct(
  id: string,
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Product> {
  const response = await apiFetch(
    `${PRODUCTS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify(product),
    },
  );

  return parseJsonResponse<Product>(response, 'Failed to update product.');
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await apiFetch(
    `${PRODUCTS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    },
  );

  await parseJsonResponse<void>(response, 'Failed to delete product.');
}
