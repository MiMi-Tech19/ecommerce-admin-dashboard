import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { LoginCredentials, UserRole } from "../types/auth";
import { ShoppingBag } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const [selectedRole, setSelectedRole] = useState<UserRole>("STAFF");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(field: keyof LoginCredentials, value: string) {
    setCredentials((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(credentials, selectedRole);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to log in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
            <ShoppingBag size={25} strokeWidth={2.2} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your e-commerce dashboard.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="role"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Sign in as
              </label>

              <select
                id="role"
                value={selectedRole}
                onChange={(event) => {
                  setSelectedRole(event.target.value as UserRole);
                  setError("");
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={(event) =>
                  handleChange("password", event.target.value)
                }
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {error && (
              <p
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign up
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-slate-500">
          Secure access to your e-commerce administration panel.
        </p>
      </div>
    </main>
  );
}
