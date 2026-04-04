import { create } from 'zustand';
import type { Review } from '@/types';
import axios from 'axios';

const API_URL = 'https://lm7at7at-back.vercel.app/api';

interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  fetchReviews: (productId: string) => Promise<void>;
  addReview: (
    productId: string,
    rating: number,
    comment: string,
    token: string
  ) => Promise<boolean>;
  deleteReview: (reviewId: string, token: string) => Promise<boolean>;
}

const transformReview = (dbReview: any): Review => ({
  id: dbReview.id,
  productId: dbReview.product_id || dbReview.productId,
  user: dbReview.user,
  userName: dbReview.user_name || dbReview.userName,
  rating: dbReview.rating,
  comment: dbReview.comment,
  commentAr: dbReview.comment_ar || dbReview.commentAr,
  images: dbReview.images || [],
  verified: dbReview.verified,
  createdAt: dbReview.created_at || dbReview.createdAt,
});

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  isLoading: false,
  error: null,

  fetchReviews: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/reviews/${productId}`);

      const reviews = (data || []).map(transformReview);
      set({ reviews, isLoading: false });
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

      const newReview = transformReview(data);
      set((state) => ({
        reviews: [newReview, ...state.reviews],
      }));

      return true;
    } catch (error) {
      console.error('Failed to add review:', error);
      return false;
    }
  },

  deleteReview: async (reviewId, token) => {
    try {
      await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        reviews: state.reviews.filter((r) => r.id !== reviewId),
      }));

      return true;
    } catch (error) {
      console.error('Failed to delete review:', error);
      return false;
    }
  },
}));