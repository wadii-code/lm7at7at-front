import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';
import axios from 'axios';

const API_URL = 'https://lm7at7at-back.vercel.app/api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<{ success: boolean; role: 'admin' | 'customer' | null }>;
  logout: () => void;
  isAdmin: () => boolean;
  updateUser: (payload: { name: string; oldPassword?: string; newPassword?: string }) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          await axios.post(`${API_URL}/signup`, { name, email, password });
          set({ isLoading: false });
          return true;
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post(`${API_URL}/login`, { email, password });
          set({ 
            user: data.user, 
            token: data.token, 
            isAuthenticated: true, 
            isLoading: false, 
            error: null 
          });
          // Return success and the user's role for redirection
          return { success: true, role: data.user.is_admin ? 'admin' : 'customer' };
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Invalid credentials or server error.';
          set({ isLoading: false, error: errorMessage, isAuthenticated: false, user: null, token: null });
          return { success: false, role: null };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      isAdmin: () => {
        const user = get().user;
        // The user object from the backend has `is_admin` (snake_case)
        return user ? (user as any).is_admin === true : false;
      },

      updateUser: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { token } = get();
          if (!token) throw new Error("Not authenticated");

          const { data } = await axios.put(`${API_URL}/profile`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set((state) => ({ 
            user: { ...state.user, ...data.user }, 
            isLoading: false 
          }));
          return true;
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Failed to update profile.';
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
    }
  )
);