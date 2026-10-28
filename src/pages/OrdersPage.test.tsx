import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OrdersPage } from "./OrdersPage";
import type { Order } from "../types";

const { updateMutateMock, invalidateQueriesMock } = vi.hoisted(() => ({
  updateMutateMock: vi.fn(),
  invalidateQueriesMock: vi.fn(),
}));

const sampleOrders: Order[] = [
  {
    id: "ORD-1001",
    customerName: "Jane Doe",
    customerEmail: "jane@example.com",
    items: [
      {
        productId: "product-1",
        productName: "Wireless Headphones",
        quantity: 2,
        unitPrice: 49.99,
      },
    ],
    total: 99.98,
    status: "pending",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
  },
];

vi.mock("../hooks/useOrders", () => ({
  useOrders: () => ({
    data: sampleOrders,
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("../hooks/useUpdateOrderStatus", () => ({
  useUpdateOrderStatus: () => ({
    mutate: updateMutateMock,
    reset: vi.fn(),
    isPending: false,
    isError: false,
    variables: undefined,
  }),
}));

function renderOrdersPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  queryClient.invalidateQueries = invalidateQueriesMock;

  return render(
    <QueryClientProvider client={queryClient}>
      <OrdersPage />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("OrdersPage", () => {
  it("displays the order and its current status", () => {
    renderOrdersPage();

    expect(screen.getAllByText("ORD-1001").length).toBeGreaterThan(0);
   expect(
  screen.getAllByRole("combobox", {
    name: "Update status for order ORD-1001",
  })[0],
).toHaveValue("pending");
    expect(
  screen.getAllByRole("combobox", {
    name: "Update status for order ORD-1001",
  })[0],
).toHaveValue("pending");
  });

  it("submits the selected status for the correct order", async () => {
    const user = userEvent.setup();
    renderOrdersPage();

    await user.selectOptions(
      screen.getAllByRole("combobox", {
        name: "Update status for order ORD-1001",
      })[0],
      "processing",
    );

    expect(updateMutateMock).toHaveBeenCalledWith({
      id: "ORD-1001",
      status: "processing",
    });
  });
});
