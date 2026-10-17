import type { FallbackProps } from "react-error-boundary";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center"
      role="alert"
    >
      <h1 className="text-2xl font-bold">Something went wrong</h1>

      <p className="max-w-md text-muted-foreground">
        An unexpected error occurred. You can try again or return to the
        dashboard.
      </p>

      {import.meta.env.DEV && (
        <pre className="max-w-full overflow-auto rounded-md bg-muted p-3 text-left text-sm">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred."}
        </pre>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          onClick={resetErrorBoundary}
        >
          Try again
        </button>

        <button
          type="button"
          className="rounded-md border px-4 py-2"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Return to dashboard
        </button>
      </div>
    </main>
  );
}
