import { http, HttpResponse } from "msw";
import type { Order, OrderStatus, Product } from "../types";
import { dashboardAnalytics } from "./data/analytics";
import { orders } from "./data/orders";
import { products } from "./data/products";

const PRODUCTS_STORAGE_KEY = "shopadmin-products";
const currentOrders: Order[] = orders.map((order) => ({ ...order }));

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (
    !("id" in value) ||
    typeof value.id !== "string" ||
    !("name" in value) ||
    typeof value.name !== "string" ||
    !("description" in value) ||
    typeof value.description !== "string" ||
    !("category" in value) ||
    typeof value.category !== "string" ||
    !("price" in value) ||
    typeof value.price !== "number" ||
    !("stock" in value) ||
    typeof value.stock !== "number" ||
    !("status" in value) ||
    (value.status !== "active" &&
      value.status !== "draft" &&
      value.status !== "archived") ||
    !("imageUrl" in value) ||
    typeof value.imageUrl !== "string" ||
    !("createdAt" in value) ||
    typeof value.createdAt !== "string" ||
    !("updatedAt" in value) ||
    typeof value.updatedAt !== "string"
  ) {
    return false;
  }

  return true;
}

function loadProducts(): Product[] {
  try {
    const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);

    if (savedProducts !== null) {
      const parsed: unknown = JSON.parse(savedProducts);

      if (Array.isArray(parsed) && parsed.every(isProduct)) {
        return parsed;
      }
    }
  } catch {
    // Use the default products if saved data is unavailable or invalid.
  }

  return [...products];
}

const currentProducts = loadProducts();

function saveProducts(): void {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(currentProducts));
  } catch {
    // Keep the in-memory data available if browser storage fails.
  }
}

export const handlers = [
  http.get("/api/products", () => {
    return HttpResponse.json(currentProducts);
  }),

  http.post("/api/products", async ({ request }) => {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("name" in body) ||
      typeof body.name !== "string" ||
      !("description" in body) ||
      typeof body.description !== "string" ||
      !("category" in body) ||
      typeof body.category !== "string" ||
      !("price" in body) ||
      typeof body.price !== "number" ||
      !("stock" in body) ||
      typeof body.stock !== "number" ||
      !("status" in body) ||
      (body.status !== "active" &&
        body.status !== "draft" &&
        body.status !== "archived") ||
      !("imageUrl" in body) ||
      typeof body.imageUrl !== "string"
    ) {
      return HttpResponse.json(
        { message: "Invalid product data" },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: body.name,
      description: body.description,
      category: body.category,
      price: body.price,
      stock: body.stock,
      status: body.status,
      imageUrl: body.imageUrl,
      createdAt: now,
      updatedAt: now,
    };

    currentProducts.push(newProduct);
    saveProducts();

    return HttpResponse.json(newProduct, { status: 201 });
  }),

  http.put("/api/products/:id", async ({ params, request }) => {
    const id = params.id;

    if (typeof id !== "string") {
      return HttpResponse.json(
        { message: "Invalid product ID" },
        { status: 400 },
      );
    }

    const productIndex = currentProducts.findIndex(
      (product) => product.id === id,
    );

    if (productIndex === -1) {
      return HttpResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("name" in body) ||
      typeof body.name !== "string" ||
      !("description" in body) ||
      typeof body.description !== "string" ||
      !("category" in body) ||
      typeof body.category !== "string" ||
      !("price" in body) ||
      typeof body.price !== "number" ||
      !("stock" in body) ||
      typeof body.stock !== "number" ||
      !("status" in body) ||
      (body.status !== "active" &&
        body.status !== "draft" &&
        body.status !== "archived") ||
      !("imageUrl" in body) ||
      typeof body.imageUrl !== "string"
    ) {
      return HttpResponse.json(
        { message: "Invalid product data" },
        { status: 400 },
      );
    }

    const existingProduct = currentProducts[productIndex];

    if (!existingProduct) {
      return HttpResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    const updatedProduct: Product = {
      ...existingProduct,
      name: body.name,
      description: body.description,
      category: body.category,
      price: body.price,
      stock: body.stock,
      status: body.status,
      imageUrl: body.imageUrl,
      updatedAt: new Date().toISOString(),
    };

    currentProducts[productIndex] = updatedProduct;
    saveProducts();

    return HttpResponse.json(updatedProduct);
  }),

  http.delete("/api/products/:id", ({ params }) => {
    const id = params.id;

    if (typeof id !== "string") {
      return HttpResponse.json(
        { message: "Invalid product ID" },
        { status: 400 },
      );
    }

    const productIndex = currentProducts.findIndex(
      (product) => product.id === id,
    );

    if (productIndex === -1) {
      return HttpResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    currentProducts.splice(productIndex, 1);
    saveProducts();

    return new HttpResponse(null, { status: 204 });
  }),

  http.get("/api/analytics/dashboard", () => {
    return HttpResponse.json(dashboardAnalytics);
  }),

 http.get("/api/orders", () => {
  return HttpResponse.json(currentOrders);
}),

http.patch("/api/orders/:id/status", async ({ params, request }) => {
  const id = params.id;

  if (typeof id !== "string") {
    return HttpResponse.json(
      { message: "Invalid order ID" },
      { status: 400 },
    );
  }

  const orderIndex = currentOrders.findIndex((order) => order.id === id);

  if (orderIndex === -1) {
    return HttpResponse.json(
      { message: "Order not found" },
      { status: 404 },
    );
  }

  const body: unknown = await request.json();

  if (
    typeof body !== "object" ||
    body === null ||
    !("status" in body) ||
    typeof body.status !== "string" ||
    !(
      ["pending", "processing", "shipped", "delivered", "cancelled"] as const
    ).includes(body.status as OrderStatus)
  ) {
    return HttpResponse.json(
      { message: "Invalid order status" },
      { status: 400 },
    );
  }

  const existingOrder = currentOrders[orderIndex];

  if (!existingOrder) {
    return HttpResponse.json(
      { message: "Order not found" },
      { status: 404 },
    );
  }

  const updatedOrder: Order = {
    ...existingOrder,
    status: body.status as OrderStatus,
    updatedAt: new Date().toISOString(),
  };

  currentOrders[orderIndex] = updatedOrder;

  return HttpResponse.json(updatedOrder);
}),
]