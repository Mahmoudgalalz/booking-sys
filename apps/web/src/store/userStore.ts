import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../lib/types/auth';

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isProvider: boolean;
  setUser: (user: User | null) => void;
  setIsProvider: (isProvider: boolean) => void;
  setToken: (token: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isProvider: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setIsProvider: (isProvider) => set({ isProvider }),
      setToken: (token) => set({ token }),
      clearUser: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
