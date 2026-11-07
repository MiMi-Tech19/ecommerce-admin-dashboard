import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/products";
import { getOrders, updateOrderStatus } from "../services/orders";
import { getDashboardAnalytics } from "../services/analytics";

import { useProducts } from "./useProducts";
import { useOrders } from "./useOrders";
import { useDashboardAnalytics } from "./useDashboardAnalytics";
import { useCreateProduct } from "./useCreateProduct";
import { useUpdateProduct } from "./useUpdateProduct";
import { useDeleteProduct } from "./useDeleteProduct";
import { useUpdateOrderStatus } from "./useUpdateOrderStatus";

vi.mock("../services/products", () => ({
  getProducts: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

vi.mock("../services/orders", () => ({
  getOrders: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

vi.mock("../services/analytics", () => ({
  getDashboardAnalytics: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: true,
    user: {
      id: "user-1",
      name: "Test Admin",
      email: "admin@example.com",
      role: "ADMIN",
    },
    isInitializing: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  })),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return {
    queryClient,
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  };
}

describe("query hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches products", async () => {
    const products = [{ id: "p1", name: "Test product" }];
    vi.mocked(getProducts).mockResolvedValue(products as never);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(products);
    expect(getProducts).toHaveBeenCalledOnce();
  });

  it("exposes a product query error", async () => {
    vi.mocked(getProducts).mockRejectedValue(new Error("Products failed"));

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeInstanceOf(Error);
    });

    expect(result.current.error).toEqual(
      expect.objectContaining({ message: "Products failed" }),
    );
  });

  it("fetches orders", async () => {
    const orders = [{ id: "o1" }];
    vi.mocked(getOrders).mockResolvedValue(orders as never);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useOrders(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(orders);
    expect(getOrders).toHaveBeenCalledOnce();
  });

  it("fetches dashboard analytics", async () => {
    const analytics = { totalRevenue: 1000 };
    vi.mocked(getDashboardAnalytics).mockResolvedValue(analytics as never);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboardAnalytics(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(analytics);
  });
});

describe("mutation hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates a product and invalidates the products query", async () => {
    vi.mocked(createProduct).mockResolvedValue({ id: "p1" } as never);

    const { wrapper, queryClient } = createWrapper();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useCreateProduct(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        name: "Test product",
        price: 10,
        stock: 2,
      } as never);
    });

    expect(createProduct).toHaveBeenCalledOnce();
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["products"] });
  });

  it("updates a product and invalidates the products query", async () => {
    vi.mocked(updateProduct).mockResolvedValue({ id: "p1" } as never);

    const { wrapper, queryClient } = createWrapper();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useUpdateProduct(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        id: "p1",
        product: { name: "Updated product", price: 12, stock: 3 },
      } as never);
    });

    expect(updateProduct).toHaveBeenCalledOnce();
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["products"] });
  });

  it("deletes a product and invalidates the products query", async () => {
    vi.mocked(deleteProduct).mockResolvedValue(undefined);

    const { wrapper, queryClient } = createWrapper();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useDeleteProduct(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync("p1");
    });

    expect(deleteProduct).toHaveBeenCalledWith("p1");
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["products"] });
  });

  it("updates an order status and invalidates the orders query", async () => {
    vi.mocked(updateOrderStatus).mockResolvedValue({ id: "o1" } as never);

    const { wrapper, queryClient } = createWrapper();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useUpdateOrderStatus(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        id: "o1",
        status: "shipped",
      } as never);
    });

    expect(updateOrderStatus).toHaveBeenCalledWith("o1", "shipped");
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["orders"] });
  });
});
