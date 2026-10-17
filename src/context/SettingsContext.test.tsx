import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { SettingsProvider, useSettings } from "./SettingsContext";

function SettingsDisplay() {
  const { settings } = useSettings();

  return (
    <div>
      <p>Admin: {settings.adminName}</p>
      <p>Email: {settings.adminEmail}</p>
      <p>Store: {settings.storeName}</p>
      <p>Description: {settings.storeDescription}</p>
      <p>Email notifications: {String(settings.emailNotifications)}</p>
      <p>Low stock notifications: {String(settings.lowStockNotifications)}</p>
      <p>Dark mode: {String(settings.darkMode)}</p>
    </div>
  );
}

function renderSettings() {
  return render(
    <SettingsProvider>
      <SettingsDisplay />
    </SettingsProvider>,
  );
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("SettingsProvider localStorage validation", () => {
  it("uses defaults when saved settings contain invalid JSON", () => {
    localStorage.setItem("shopadmin-settings", "{invalid json");

    renderSettings();

    expect(screen.getByText("Admin: Admin User")).toBeInTheDocument();
    expect(screen.getByText("Store: ShopAdmin")).toBeInTheDocument();
    expect(screen.getByText("Dark mode: false")).toBeInTheDocument();
  });

  it("uses defaults when saved settings are not an object", () => {
    localStorage.setItem("shopadmin-settings", "null");

    renderSettings();

    expect(screen.getByText("Admin: Admin User")).toBeInTheDocument();
    expect(screen.getByText("Store: ShopAdmin")).toBeInTheDocument();
  });

  it("uses defaults for fields with incorrect types while preserving valid fields", () => {
    localStorage.setItem(
      "shopadmin-settings",
      JSON.stringify({
        adminName: 123,
        adminEmail: "saved@example.com",
        storeName: false,
        storeDescription: "Saved description",
        emailNotifications: "yes",
        lowStockNotifications: false,
        darkMode: true,
      }),
    );

    renderSettings();

    expect(screen.getByText("Admin: Admin User")).toBeInTheDocument();
    expect(screen.getByText("Email: saved@example.com")).toBeInTheDocument();
    expect(screen.getByText("Store: ShopAdmin")).toBeInTheDocument();
    expect(
      screen.getByText("Description: Saved description"),
    ).toBeInTheDocument();
    expect(screen.getByText("Email notifications: true")).toBeInTheDocument();
    expect(
      screen.getByText("Low stock notifications: false"),
    ).toBeInTheDocument();
    expect(screen.getByText("Dark mode: true")).toBeInTheDocument();
  });

  it("uses defaults when saved settings are an array", () => {
    localStorage.setItem(
      "shopadmin-settings",
      JSON.stringify(["unexpected", "data"]),
    );

    renderSettings();

    expect(screen.getByText("Admin: Admin User")).toBeInTheDocument();
    expect(screen.getByText("Store: ShopAdmin")).toBeInTheDocument();
  });
});
