import { createFetch } from '@better-fetch/fetch';
import { useUserStore } from '../store/userStore';

// Create a base fetch instance with common configurations
export const $fetch = createFetch({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  // Add authorization header to each request
  onRequest: (request) => {
    const token = useUserStore.getState().token;
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
  retry: {
    type: 'exponential',
    attempts: 3,
    baseDelay: 1000,
    maxDelay: 5000
  },
});

// Create a version that throws errors for use with TanStack Query
export const $fetchThrow = createFetch({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  // Add authorization header to each request
  onRequest: (request) => {
    const token = useUserStore.getState().token;
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
  retry: {
    type: 'exponential',
    attempts: 3,
    baseDelay: 1000,
    maxDelay: 5000
  },
  throw: true, // This will throw errors instead of returning them
});
