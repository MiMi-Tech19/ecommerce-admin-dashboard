import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { RegisterCredentials } from "../types/auth";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  function handleChange(field: keyof RegisterCredentials, value: string) {
    setCredentials((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (credentials.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (credentials.password !== confirmPassword) {
      if (credentials.password.trim() === confirmPassword.trim()) {
        setError(
          "Passwords do not match due to extra spaces. Please remove any spaces.",
        );
      } else {
        setError("Passwords do not match.");
      }
      return;
    }

    setIsLoading(true);

    try {
      await register(credentials);
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/string did not match|unexpected (end|token)|syntaxerror|failed to execute 'json'/i.test(msg)) {
        setError(
          "Unable to connect to the authentication service. Please check your network connection.",
        );
      } else {
        setError(
          msg || "Unable to create your account. Please try again.",
        );
      }
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

          <h1 className="text-2xl font-bold text-slate-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign up to access your e-commerce dashboard.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                autoCapitalize="words"
                required
                minLength={2}
                value={credentials.name}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
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
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
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

              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  minLength={8}
                  value={credentials.password}
                  onChange={(event) =>
                    handleChange("password", event.target.value)
                  }
                  placeholder="At least 8 characters"
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-3 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 rounded p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>

              <div className="relative flex items-center">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="Re-enter your password"
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-3 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2.5 rounded p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>


            <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
              New accounts are registered with Staff access. An administrator
              can promote your account if you need Admin access.
            </p>

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
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
