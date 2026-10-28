
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductsPage } from "./ProductsPage";
import type { Product } from "../types";

const { mockUseProducts } = vi.hoisted(() => ({
  mockUseProducts: vi.fn(),
}));

vi.mock("../hooks/useProducts", () => ({
  useProducts: mockUseProducts,
}));

const testProducts: Product[] = [
  {
    id: "1",
    name: "Zebra Headphones",
    description: "Wireless headphones",
    category: "Electronics",
    price: 80,
    stock: 12,
    status: "active",
    imageUrl: "",
    createdAt: "2026-01-06T00:00:00.000Z",
    updatedAt: "2026-01-06T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Alpha Shoes",
    description: "Running shoes",
    category: "Fashion",
    price: 30,
    stock: 5,
    status: "active",
    imageUrl: "",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Mango Watch",
    description: "Smart watch",
    category: "Electronics",
    price: 120,
    stock: 0,
    status: "draft",
    imageUrl: "",
    createdAt: "2026-01-04T00:00:00.000Z",
    updatedAt: "2026-01-04T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Blue Mug",
    description: "Ceramic mug",
    category: "Home",
    price: 15,
    stock: 25,
    status: "active",
    imageUrl: "",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "5",
    name: "Green Lamp",
    description: "Desk lamp",
    category: "Home",
    price: 45,
    stock: 8,
    status: "archived",
    imageUrl: "",
    createdAt: "2026-01-05T00:00:00.000Z",
    updatedAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "6",
    name: "Silver Bottle",
    description: "Reusable water bottle",
    category: "Accessories",
    price: 20,
    stock: 40,
    status: "active",
    imageUrl: "",
    createdAt: "2026-01-03T00:00:00.000Z",
    updatedAt: "2026-01-03T00:00:00.000Z",
  },
];

function renderProductsPage() {
  return render(<ProductsPage />);
}

function getVisibleProductNames(): string[] {
  const table = screen.getByRole("table");
  const rows = within(table).getAllByRole("row").slice(1);

  return rows.map((row) => {
    const firstCell = within(row).getAllByRole("cell")[0];
    return firstCell.textContent ?? "";
  });
}

describe("ProductsPage sorting and pagination", () => {
  beforeEach(() => {
    mockUseProducts.mockReset();
    mockUseProducts.mockReturnValue({
      data: testProducts,
      isLoading: false,
      isError: false,
    });
  });

  it("sorts products by price in ascending order", () => {
    renderProductsPage();

    fireEvent.change(screen.getByRole("combobox", {
      name: "Sort products by",
    }), {
      target: { value: "price" },
    });

    expect(getVisibleProductNames()).toEqual([
      "Blue MugCeramic mug",
      "Silver BottleReusable water bottle",
      "Alpha ShoesRunning shoes",
      "Green LampDesk lamp",
      "Zebra HeadphonesWireless headphones",
    ]);
  });

  it("sorts products by price in descending order", () => {
    renderProductsPage();

    fireEvent.change(screen.getByRole("combobox", {
      name: "Sort products by",
    }), {
      target: { value: "price" },
    });

    fireEvent.change(screen.getByRole("combobox", {
      name: "Sort direction",
    }), {
      target: { value: "desc" },
    });

    expect(getVisibleProductNames()).toEqual([
      "Mango WatchSmart watch",
      "Zebra HeadphonesWireless headphones",
      "Green LampDesk lamp",
      "Alpha ShoesRunning shoes",
      "Silver BottleReusable water bottle",
    ]);
  });

  
it("moves to the next page and returns to the previous page", () => {
  renderProductsPage();

  expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  expect(getVisibleProductNames().join(" ")).toContain("Alpha Shoes");

  fireEvent.click(screen.getByRole("button", { name: "Next" }));

  expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  expect(getVisibleProductNames().join(" ")).toContain("Zebra Headphones");
  expect(getVisibleProductNames().join(" ")).not.toContain("Alpha Shoes");

  fireEvent.click(screen.getByRole("button", { name: "Previous" }));

  expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  expect(getVisibleProductNames().join(" ")).toContain("Alpha Shoes");
});


  it("resets to the first page when the search changes", () => {
    renderProductsPage();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", {
      name: "Search products",
    }), {
      target: { value: "Alpha Shoes" },
    });

    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
expect(screen.getAllByText("Alpha Shoes").length).toBeGreaterThan(0);  });

  it("shows an empty state when no products match the search", () => {
    renderProductsPage();

    fireEvent.change(screen.getByRole("searchbox", {
      name: "Search products",
    }), {
      target: { value: "Product that does not exist" },
    });

    expect(screen.getByText("No products found")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next" }),
    ).not.toBeInTheDocument();
  });

  it("changes the number of products displayed per page", () => {
    renderProductsPage();

    fireEvent.change(screen.getByLabelText("Rows per page"), {
      target: { value: "10" },
    });

    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
expect(screen.getAllByText("Silver Bottle").length).toBeGreaterThan(0);  });
});
