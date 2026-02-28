import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[]; // Product IDs
  
  // Actions
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (productId) => {
        set((state) => ({
          items: [...state.items, productId],
        }));
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },

      toggleWishlist: (productId) => {
        const { items, addToWishlist, removeFromWishlist } = get();
        if (items.includes(productId)) {
          removeFromWishlist(productId);
        } else {
          addToWishlist(productId);
        }
      },

      isInWishlist: (productId) => {
        return get().items.includes(productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-store',
    }
  )
);
