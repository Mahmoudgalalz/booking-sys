import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoute, RouterProvider } from '@tanstack/react-router';
import { authService } from './lib/utils/auth-service';
import SignupPage from './pages/auth/SignupPage';
import HomePage from './pages/home/HomePage';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import MainLayout from './components/layout/MainLayout';
import { createAppRouter, rootRoute } from './lib/utils/router-utils';
import './global.css';

// Create routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const isAuthenticated = authService.isAuthenticated();
    
    // Redirect to home if authenticated, otherwise show signup page
    if (isAuthenticated) {
      return (
        <MainLayout>
          <HomePage />
        </MainLayout>
      );
    }
    
    return (
      <MainLayout>
        <SignupPage />
      </MainLayout>
    );
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
    <MainLayout>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
          <p className="text-center text-gray-500">Login page to be implemented</p>
        </div>
      </div>
    </MainLayout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: () => (
    <MainLayout>
      <HomePage />
    </MainLayout>
  ),
  beforeLoad: () => {
    const isAuthenticated = authService.isAuthenticated();
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
  },
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: () => (
    <MainLayout showHeader={false}>
      <SignupPage />
    </MainLayout>
  ),
});

const providerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/provider',
  component: () => (
    <MainLayout>
      <ProviderDashboard />
    </MainLayout>
  ),
  beforeLoad: () => {
    const isAuthenticated = authService.isAuthenticated();
    const isProvider = authService.hasRole('provider');
    
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    
    if (!isProvider) {
      throw new Error('Provider role required');
    }
  },
});

// Create the route tree using the routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  homeRoute,
  signupRoute,
  providerDashboardRoute,
]);

// Create the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Create the router using the route tree
const router = createAppRouter(queryClient, routeTree);

// Register the router for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
