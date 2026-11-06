import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

async function enableMocking(): Promise<void> {
  const shouldEnableMocking = import.meta.env.VITE_ENABLE_MSW === "true";
  if (shouldEnableMocking) {
    const { worker } = await import("./mocks/browser");

    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    });
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
