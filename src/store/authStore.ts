import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
}

// Default admin credentials
const ADMIN_EMAIL = 'admin@teestore.com';
const ADMIN_PASSWORD = 'admin123';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simple authentication - in production, this would be an API call
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const adminUser: User = {
            id: 'admin-1',
            name: 'Admin',
            email: ADMIN_EMAIL,
            isAdmin: true,
            wishlist: [],
            orders: [],
          };
          set({ user: adminUser, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      isAdmin: () => {
        return get().user?.isAdmin ?? false;
      },
    }),
    {
      name: 'auth-store',
    }
  )
);
