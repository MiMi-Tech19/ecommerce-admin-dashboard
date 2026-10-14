import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { queryClient } from './lib/queryClient';
import { router } from './routes';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <RouterProvider router={router} />
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;