import { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";

export function SettingsPage() {
  const { settings, dispatch } = useSettings();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { updateProfile } = useAuth();

  function updateField<K extends keyof typeof settings>(
    field: K,
    value: (typeof settings)[K],
  ) {
    if (typeof value === "string") {
      if (
        field !== "adminName" &&
        field !== "adminEmail" &&
        field !== "storeName" &&
        field !== "storeDescription"
      ) {
        return;
      }

      dispatch({
        type: "UPDATE_TEXT_FIELD",
        field,
        value,
      });
    } else {
      if (
        field !== "emailNotifications" &&
        field !== "lowStockNotifications" &&
        field !== "darkMode"
      ) {
        return;
      }

      dispatch({
        type: "UPDATE_BOOLEAN_FIELD",
        field,
        value,
      });
    }

    setSaved(false);

    setErrors((currentErrors) => {
      if (!(field in currentErrors)) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!settings.adminName.trim()) {
      newErrors.adminName = "Admin name is required.";
    }

    if (!settings.adminEmail.trim()) {
      newErrors.adminEmail = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.adminEmail.trim())) {
      newErrors.adminEmail = "Enter a valid email address.";
    }

    if (!settings.storeName.trim()) {
      newErrors.storeName = "Store name is required.";
    }

    if (!settings.storeDescription.trim()) {
      newErrors.storeDescription = "Store description is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setSaved(false);
    setSaveError("");

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      await updateProfile(settings.adminName.trim());

      dispatch({
        type: "UPDATE_TEXT_FIELD",
        field: "adminName",
        value: settings.adminName.trim(),
      });

      setSaved(true);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to save your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Configuration</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-600">
          Manage your profile, store information, and application preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
            <p className="mt-1 text-sm text-slate-500">
              Update the administrator information.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="admin-name"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Admin Name
              </label>

              <input
                id="admin-name"
                type="text"
                value={settings.adminName}
                onChange={(event) =>
                  updateField("adminName", event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {errors.adminName && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.adminName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="admin-email"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

              <input
                id="admin-email"
                type="email"
                value={settings.adminEmail}
                onChange={(event) =>
                  updateField("adminEmail", event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {errors.adminEmail && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.adminEmail}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Store */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Store Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage your store's basic information.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="store-name"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Store Name
              </label>

              <input
                id="store-name"
                type="text"
                value={settings.storeName}
                onChange={(event) =>
                  updateField("storeName", event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {errors.storeName && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.storeName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="store-description"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Store Description
              </label>

              <textarea
                id="store-description"
                value={settings.storeDescription}
                onChange={(event) =>
                  updateField("storeDescription", event.target.value)
                }
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {errors.storeDescription && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.storeDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Notifications
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose which notifications you want to receive.
            </p>
          </div>

          <div className="space-y-5">
            <label
              htmlFor="email-notifications"
              className="flex cursor-pointer items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Email Notifications
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Receive important store updates by email.
                </p>
              </div>

              <input
                id="email-notifications"
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(event) =>
                  updateField("emailNotifications", event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300"
              />
            </label>

            <label
              htmlFor="low-stock-notifications"
              className="flex cursor-pointer items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Low Stock Alerts
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Get notified when products have low inventory.
                </p>
              </div>

              <input
                id="low-stock-notifications"
                type="checkbox"
                checked={settings.lowStockNotifications}
                onChange={(event) =>
                  updateField("lowStockNotifications", event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300"
              />
            </label>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
            <p className="mt-1 text-sm text-slate-500">
              Configure your dashboard appearance preferences.
            </p>
          </div>

          <label
            htmlFor="dark-mode"
            className="flex cursor-pointer items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-medium text-slate-900">Dark Mode</p>
              <p className="mt-1 text-xs text-slate-500">
                Use a darker appearance for the dashboard.
              </p>
            </div>

            <input
              id="dark-mode"
              type="checkbox"
              checked={settings.darkMode}
              onChange={(event) =>
                updateField("darkMode", event.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">Settings changes</p>

          {saveError && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {saveError}
            </p>
          )}

          {saved ? (
            <p className="mt-1 text-sm text-emerald-600">
              Settings saved successfully.
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">
              Review your changes before saving.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </section>
  );
}
