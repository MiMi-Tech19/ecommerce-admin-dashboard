import type { Product } from "../types";

const PRODUCTS_ENDPOINT = "/api/products";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_ENDPOINT);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json() as Promise<Product[]>;
}

export async function createProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">,
): Promise<Product> {
  const response = await fetch(PRODUCTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return response.json() as Promise<Product>;
}

export async function updateProduct(
  id: string,
  product: Omit<Product, "id" | "createdAt" | "updatedAt">,
): Promise<Product> {
  const response = await fetch(
    `${PRODUCTS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json() as Promise<Product>;
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(
    `${PRODUCTS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
}
