
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider } from 'react-router-dom';
import { ErrorFallback } from './components/errors/ErrorFallback';
import { SettingsProvider } from './context/SettingsContext';
import { queryClient } from './lib/queryClient';
import { router } from './routes';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <RouterProvider router={router} />
        </SettingsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
