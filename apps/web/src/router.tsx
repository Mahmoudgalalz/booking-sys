import { QueryClient } from '@tanstack/react-query';
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import RootLayout from './components/layout/RootLayout';
import IndexRoute from './components/routes/IndexRoute';
import HomeRoute from './components/routes/HomeRoute';
import SignupRoute from './components/routes/SignupRoute';
import LoginRoute from './components/routes/LoginRoute';
import ProviderRoute from './components/routes/ProviderRoute';
import BookingsRoute from './components/routes/BookingsRoute';

interface RouterContext {
  queryClient: QueryClient;
}
const rootRoute = createRootRoute<RouterContext>({
  component: RootLayout
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexRoute
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: HomeRoute
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupRoute
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginRoute
});

const providerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/provider',
  component: ProviderRoute
});

const bookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bookings',
  component: BookingsRoute
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  homeRoute,
  signupRoute,
  loginRoute,
  providerRoute,
  bookingsRoute
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 1000 * 60 * 5, // 5 minutes
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
