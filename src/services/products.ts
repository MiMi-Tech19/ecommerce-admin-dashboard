
import type { Product } from '../types';
import { apiFetch } from './api';

const PRODUCTS_ENDPOINT = '/api/products';

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const data = (await response.json()) as {
      message?: string;
    };

    return data.message || fallback;
  } catch {
    return fallback;
  }
}

export async function getProducts(): Promise<Product[]> {
  const response = await apiFetch(PRODUCTS_ENDPOINT);

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Failed to fetch products.'),
    );
  }

  return response.json() as Promise<Product[]>;
}

export async function createProduct(
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Product> {
  const response = await apiFetch(PRODUCTS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Failed to create product.'),
    );
  }

  return response.json() as Promise<Product>;
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

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Failed to update product.'),
    );
  }

  return response.json() as Promise<Product>;
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await apiFetch(
    `${PRODUCTS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Failed to delete product.'),
    );
  }
}
