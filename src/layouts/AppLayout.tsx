import { useState } from "react";
import {
  BarChart3,
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  Package,
  Search,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
interface NavigationItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
}

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    path: "/products",
    icon: Package,
  },
  {
    label: "Orders",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    label: "User Management",
    path: "/users",
    icon: Users,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const visibleNavigationItems = navigationItems.filter(
    (item) => item.path !== "/users" || user?.role === "ADMIN",
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
              SA
            </div>

            <div>
              <h1 className="font-bold text-slate-900">ShopAdmin</h1>

              <p className="text-xs text-slate-500">E-Commerce</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>

          <ul className="space-y-1">
            {visibleNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-900">Store status</p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
              SA
            </div>

            <div>
              <h1 className="font-bold text-slate-900">ShopAdmin</h1>

              <p className="text-xs text-slate-500">E-Commerce</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>

          <ul className="space-y-1">
            {visibleNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-900">Store status</p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900 sm:px-6">
          {" "}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Welcome back
              </p>

              <h2 className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                Admin Dashboard
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <div className="hidden items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 lg:flex">
              {" "}
              <Search size={16} className="text-slate-400" />
              <input
                type="search"
                placeholder="Search..."
                aria-label="Search dashboard"
                className="ml-2 w-40 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>

            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Bell size={19} />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* User */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3 dark:border-slate-700">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user?.name ?? "User"}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>

                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {user?.role === "ADMIN" ? "Administrator" : "Staff"}
                </p>
              </div>

              <div
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white"
                aria-label={`${user?.name ?? "User"} profile`}
              >
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
                className="rounded-lg p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950"
              >
                <LogOut size={19} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
