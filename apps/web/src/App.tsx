import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { ToastProvider } from './components/ui/ToastProvider';
import './global.css';

// Import router from our router file
import { router } from './router';

// Create the query client for the App component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
