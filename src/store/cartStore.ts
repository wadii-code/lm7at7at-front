import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from '@/types';
import { toast } from 'sonner';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  
  // Getters
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, size, color) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.id === product.id &&
              item.selectedSize === size &&
              item.selectedColor === color
          );

          const stock = product.stockQuantity || 0;

          if (existingItem) {
            if (existingItem.quantity >= stock) {
              toast.error(`Only ${stock} items available in stock.`);
              return state; // Do not update if stock limit is reached
            }
            return {
              items: state.items.map((item) =>
                item.id === product.id &&
                item.selectedSize === size &&
                item.selectedColor === color
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          if (stock < 1) {
            toast.error(`This item is out of stock.`);
            return state; // Do not add if out of stock
          }

          const cartItem: CartItem = {
            ...product,
            quantity: 1,
            selectedSize: size,
            selectedColor: color,
          };

          return { items: [...state.items, cartItem] };
        });
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.id === productId &&
                item.selectedSize === size &&
                item.selectedColor === color
              )
          ),
        }));
      },

      updateQuantity: (productId, size, color, quantity) => {
        const itemToUpdate = get().items.find(
          (item) =>
            item.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
        );

        if (!itemToUpdate) return; // Should not happen, but good practice

        const stock = itemToUpdate.stockQuantity || 0;
        let newQuantity = quantity;

        if (quantity > stock) {
          toast.error(`Only ${stock} items available in stock.`);
          newQuantity = stock; // Cap quantity at stock level
        }

        if (newQuantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
              ? { ...item, quantity: newQuantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setCartOpen: (open) => set({ isOpen: open }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: (productId) => {
        return get().items
          .filter((item) => item.id === productId)
          .reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-store',
    }
  )
);