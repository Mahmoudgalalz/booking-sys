import { QueryClient } from '@tanstack/react-query';
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import RootLayout from './components/layout/RootLayout';
import IndexRoute from './components/routes/IndexRoute';
import HomeRoute from './components/routes/HomeRoute';
import SignupRoute from './components/routes/SignupRoute';
import ProviderRoute from './components/routes/ProviderRoute';

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

const providerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/provider',
  component: ProviderRoute
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  homeRoute,
  signupRoute,
  providerRoute
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
