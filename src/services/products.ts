
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

export async function getProducts(
  token: string | null = null,
): Promise<Product[]> {
  const response = await apiFetch(PRODUCTS_ENDPOINT, token);

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Failed to fetch products.'),
    );
  }

  return response.json() as Promise<Product[]>;
}

export async function createProduct(
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  token: string | null = null,
): Promise<Product> {
  const response = await apiFetch(PRODUCTS_ENDPOINT, token, {
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
  token: string | null = null,
): Promise<Product> {
  const response = await apiFetch(
    `${PRODUCTS_ENDPOINT}/${encodeURIComponent(id)}`,
    token,
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

export async function deleteProduct(
  id: string,
  token: string | null = null,
): Promise<void> {
  const response = await apiFetch(
    `${PRODUCTS_ENDPOINT}/${encodeURIComponent(id)}`,
    token,
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
