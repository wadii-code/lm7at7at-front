import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Product } from './productStore';

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  removeOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        })),
      removeOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        })),
    }),
    {
      name: 'order-storage',
    }
  )
);