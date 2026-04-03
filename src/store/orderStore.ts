import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import type { CartItem } from '@/types';
import { useAuthStore } from './authStore';

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  email?: string;
  city?: string;
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
  isLoading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;
  fetchDeliveredOrders: () => Promise<void>;
  addOrder: (order: Order) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<boolean>;
  removeOrder: (orderId: string) => Promise<boolean>;
}

const transformOrder = (dbOrder: any): Order => ({
  id: dbOrder.id,
  customer: {
    name: dbOrder.customer_name,
    phone: dbOrder.customer_phone,
    email: dbOrder.customer_email,
    address: dbOrder.address,
    city: dbOrder.city,
  },
  items: dbOrder.items || [],
  total: parseFloat(dbOrder.total) || 0,
  date: dbOrder.created_at,
  status: dbOrder.status || 'pending',
});

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      isLoading: false,
      error: null,

      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = useAuthStore.getState().token;

          if (!token) {
            set({ orders: [], isLoading: false });
            return;
          }

          const response = await axios.get('https://lm7at7at-back.vercel.app/api/orders', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const orders = (response.data || []).map(transformOrder);
          set({ orders, isLoading: false });

        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
        }
      },

      fetchDeliveredOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = useAuthStore.getState().token;
          if (!token) {
            set({ orders: [], isLoading: false });
            return;
          }
          const response = await axios.get('http://localhost:3001/api/orders?status=delivered', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const orders = (response.data || []).map(transformOrder);
          set({ orders, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
        }
      },

      addOrder: async (order) => {
        set({ isLoading: true });
        try {
          const token = useAuthStore.getState().token;

          const orderData = {
            customer: order.customer,
            items: order.items,
            total: order.total,
            status: order.status,
          };

          const response = await axios.post(
            'http://localhost:3001/api/orders',
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const newOrder = transformOrder(response.data);

          set((state) => ({
            orders: [newOrder, ...state.orders],
            isLoading: false,
          }));

          return true;

        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return false;
        }
      },

      updateOrderStatus: async (orderId, status) => {
        set({ isLoading: true });
        try {
          const token = useAuthStore.getState().token;

          if (!token) {
            set({ error: 'Authentication token not found.', isLoading: false });
            return false;
          }

          const { data } = await axios.patch(
            `http://localhost:3001/api/orders/${orderId}/status`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const updatedOrder = transformOrder(data);

          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === updatedOrder.id ? updatedOrder : order
            ),
            isLoading: false,
          }));

          return true;

        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return false;
        }
      },

      removeOrder: async (orderId) => {
        set({ isLoading: true });
        try {
          const token = useAuthStore.getState().token;

          if (!token) {
            set({ error: 'Authentication token not found.', isLoading: false });
            return false;
          }

          await axios.delete(`http://localhost:3001/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set((state) => ({
            orders: state.orders.filter((order) => order.id !== orderId),
            isLoading: false,
          }));

          return true;

        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return false;
        }
      },
    }),
    {
      name: 'order-storage',
    }
  )
);