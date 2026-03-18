import { create } from 'zustand';
import type { Review } from '@/types';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Correct API URL

interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  fetchReviews: (productId: string) => Promise<void>;
  addReview: (productId: string, rating: number, comment: string, token: string) => Promise<boolean>;
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  isLoading: false,
  error: null,

  fetchReviews: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/reviews/${productId}`);
      set({ reviews: data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ isLoading: false, error: errorMessage });
    }
  },

  addReview: async (productId, rating, comment, token) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/reviews/${productId}`,
        { rating, comment },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({ reviews: [data, ...state.reviews] }));
      return true;
    } catch (error) {
      console.error('Failed to add review:', error);
      return false;
    }
  },
}));