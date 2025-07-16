import { createRootRouteWithContext, createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";

// Define the router context type
export interface RouterContext {
  queryClient: QueryClient;
}

// Create the root route with context
export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => null, // Will be replaced by the root layout
});

/**
 * Create a router instance with the provided routes and context
 */
export function createAppRouter(queryClient: QueryClient, routes: any) {
  return createRouter({
    routeTree: routes,
    context: {
      queryClient,
    },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Helper for route guards based on authentication
 */
export function requireAuth(isAuthenticated: boolean) {
  if (!isAuthenticated) {
    throw new Error("Authentication required");
  }
}

/**
 * Helper for role-based route guards
 */
export function requireRole(userRole: string | undefined, allowedRoles: string[]) {
  if (!userRole || !allowedRoles.includes(userRole)) {
    throw new Error("Unauthorized access");
  }
}
