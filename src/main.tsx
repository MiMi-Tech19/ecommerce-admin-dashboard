import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

async function enableMocking(): Promise<void> {
  const hasBackendUrl = Boolean(
    import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL,
  );
  const mswEnv = import.meta.env.VITE_ENABLE_MSW;

  // Enable MSW if explicitly enabled, or by default when running without a remote backend API
  const shouldEnableMocking =
    mswEnv === "true" || (mswEnv !== "false" && !hasBackendUrl);

  if (shouldEnableMocking) {
    try {
      const { worker } = await import("./mocks/browser");

      await worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: {
          url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
        },
      });
    } catch (err) {
      console.warn("Could not start Mock Service Worker:", err);
    }
  }
}

async function bootstrap(): Promise<void> {
  await enableMocking();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

void bootstrap();
