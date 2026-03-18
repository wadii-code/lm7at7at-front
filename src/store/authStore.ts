import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
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
          return true;
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Invalid credentials or server error.';
          set({ isLoading: false, error: errorMessage, isAuthenticated: false, user: null, token: null });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      isAdmin: () => {
        return get().user?.isAdmin ?? false;
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