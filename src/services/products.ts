import type { Product } from '../types';

const PRODUCTS_ENDPOINT = '/api/products';

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_ENDPOINT);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json() as Promise<Product[]>;
}