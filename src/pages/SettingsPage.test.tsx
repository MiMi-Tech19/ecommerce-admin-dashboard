import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsProvider } from "../context/SettingsContext";
import { SettingsPage } from "./SettingsPage";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    updateProfile: vi.fn().mockResolvedValue(undefined),
  }),
}));

function renderSettingsPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <SettingsProvider>
          <SettingsPage />
        </SettingsProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
describe("SettingsPage form validation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows required-field errors when the form is submitted empty", () => {
    renderSettingsPage();

    fireEvent.change(screen.getByLabelText(/admin name/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/store name/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/store description/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByText("Admin name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email address is required.")).toBeInTheDocument();
    expect(screen.getByText("Store name is required.")).toBeInTheDocument();
    expect(
      screen.getByText("Store description is required."),
    ).toBeInTheDocument();
  });

  it("rejects an invalid email address", () => {
    renderSettingsPage();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "invalid-email" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      screen.getByText("Enter a valid email address."),
    ).toBeInTheDocument();
  });

  it("shows a success message when valid settings are saved", async () => {
    renderSettingsPage();
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText(/settings saved successfully/i),
    ).toBeInTheDocument();
  });

  it("clears a field error when that field is edited", () => {
    renderSettingsPage();

    fireEvent.change(screen.getByLabelText(/admin name/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByText("Admin name is required.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/admin name/i), {
      target: { value: "Store Administrator" },
    });

    expect(
      screen.queryByText("Admin name is required."),
    ).not.toBeInTheDocument();
  });
});
