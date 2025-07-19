import { createFetch } from '@better-fetch/fetch';
import { useUserStore } from '../store/userStore';

export const $fetch = createFetch({
  baseURL: 'http://localhost:3005',
  headers: {
    'Content-Type': 'application/json'
  },
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

export const $fetchThrow = createFetch({
  baseURL: 'http://localhost:3005',
  headers: {
    'Content-Type': 'application/json'
  },
  onRequest: (request) => {
    const token = useUserStore.getState().token;
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Serialize body to JSON for POST, PUT, PATCH methods
    if (request.method !== 'GET' && request.body && typeof request.body === 'object') {
      request.body = JSON.stringify(request.body);
    }
    
    return request;
  },
  retry: {
    type: 'exponential',
    attempts: 3,
    baseDelay: 1000,
    maxDelay: 5000
  },
  throw: true,
});
