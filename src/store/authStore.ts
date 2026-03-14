import { create } from 'zustand';
import type { User } from '@/types';
import type { TSet, TGet } from './store.types';

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

export const useAuthStore = create<AuthState>((set: TSet<AuthState>, get: TGet<AuthState>) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // TODO: Replace with API call
        console.log(`Logging in with ${email} (API call needed)`);
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
        // TODO: Add API call for logout if needed
        set({ user: null, isAuthenticated: false });
      },

      isAdmin: () => {
        return get().user?.isAdmin ?? false;
      },
    }));