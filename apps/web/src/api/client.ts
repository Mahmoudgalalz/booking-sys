import { createFetch } from '@better-fetch/fetch';
import { useUserStore } from '../store/userStore';

// Create a base fetch instance with common configurations
export const $fetch = createFetch({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    get Authorization() {
      const token = useUserStore.getState().token;
      return token ? `Bearer ${token}` : undefined;
    }
  },
  retry: {
    type: 'exponential',
    attempts: 3,
    factor: 2, // Instead of delay, use factor for exponential backoff
  },
});

// Create a version that throws errors for use with TanStack Query
export const $fetchThrow = createFetch({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    get Authorization() {
      const token = useUserStore.getState().token;
      return token ? `Bearer ${token}` : undefined;
    }
  },
  retry: {
    type: 'exponential',
    attempts: 3,
    factor: 2, // Instead of delay, use factor for exponential backoff
  },
  throw: true, // This will throw errors instead of returning them
});
