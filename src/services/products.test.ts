import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "./products";
import type { Product } from "../types";

const sampleProduct = {
  name: "Test Product",
  price: 25,
  stock: 10,
} as Omit<Product, "id" | "createdAt" | "updatedAt">;

afterEach(() => {
  vi.unstubAllGlobals();
});

function expectCookieRequest(
  fetchMock: ReturnType<typeof vi.fn>,
  url: string,
  method = "GET",
  body?: string,
) {
  expect(fetchMock).toHaveBeenCalledOnce();

  const [calledUrl, options] = fetchMock.mock.calls[0];

  expect(calledUrl).toBe(url);
  expect(options.credentials).toBe("include");

  if (method !== "GET") {
    expect(options.method).toBe(method);
  }

  expect(options.headers).toBeInstanceOf(Headers);

  if (body !== undefined) {
    expect(options.headers.get("Content-Type")).toBe("application/json");
    expect(options.body).toBe(body);
  }
}

describe("getProducts", () => {
  it("returns products when the request succeeds", async () => {
    const products = [{ id: "product-1", ...sampleProduct }] as Product[];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(products),
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(getProducts()).resolves.toEqual(products);

    expectCookieRequest(fetchMock, "/api/products");
  });

  it("throws when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(getProducts()).rejects.toThrow("Failed to fetch products");
  });
});

describe("createProduct", () => {
  it("sends product data and returns the created product", async () => {
    const created = { id: "product-1", ...sampleProduct } as Product;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(created),
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(createProduct(sampleProduct)).resolves.toEqual(created);

    expectCookieRequest(
      fetchMock,
      "/api/products",
      "POST",
      JSON.stringify(sampleProduct),
    );
  });

  it("throws when creation fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(createProduct(sampleProduct)).rejects.toThrow(
      "Failed to create product",
    );
  });
});

describe("updateProduct", () => {
  it("sends updated product data and returns the updated product", async () => {
    const updated = { id: "product-1", ...sampleProduct } as Product;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(updated),
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(updateProduct("product-1", sampleProduct)).resolves.toEqual(
      updated,
    );

    expectCookieRequest(
      fetchMock,
      "/api/products/product-1",
      "PUT",
      JSON.stringify(sampleProduct),
    );
  });

  it("throws when updating fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(updateProduct("product-1", sampleProduct)).rejects.toThrow(
      "Failed to update product",
    );
  });
});

describe("deleteProduct", () => {
  it("deletes a product successfully", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await expect(deleteProduct("product-1")).resolves.toBeUndefined();

    expectCookieRequest(fetchMock, "/api/products/product-1", "DELETE");
  });

  it("throws when deletion fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(deleteProduct("product-1")).rejects.toThrow(
      "Failed to delete product",
    );
  });

  it("encodes the product ID in the URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await deleteProduct("product/1");

    expectCookieRequest(fetchMock, "/api/products/product%2F1", "DELETE");
  });
});
