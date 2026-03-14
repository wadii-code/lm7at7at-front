import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { CartItem } from '@/types';

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
          if (!isSupabaseConfigured() || !supabase) {
            set({ isLoading: false });
            return;
          }

          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          const orders = (data || []).map(transformOrder);
          set({ orders, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching orders:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      addOrder: async (order) => {
        try {
          if (!isSupabaseConfigured() || !supabase) {
            set((state) => ({
              orders: [order, ...state.orders],
            }));
            return true;
          }

          const { error } = await supabase.from('orders').insert({
            customer_name: order.customer.name,
            customer_phone: order.customer.phone,
            customer_email: order.customer.email || '',
            address: order.customer.address,
            city: order.customer.city || '',
            items: order.items,
            total: order.total,
            status: order.status,
          });

          if (error) throw error;

          set((state) => ({
            orders: [order, ...state.orders],
          }));
          return true;
        } catch (error) {
          console.error('Error adding order:', error);
          return false;
        }
      },

      updateOrderStatus: async (orderId, status) => {
        try {
          if (!isSupabaseConfigured() || !supabase) {
            set((state) => ({
              orders: state.orders.map((order) =>
                order.id === orderId ? { ...order, status } : order
              ),
            }));
            return true;
          }

          const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

          if (error) throw error;

          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === orderId ? { ...order, status } : order
            ),
          }));
          return true;
        } catch (error) {
          console.error('Error updating order status:', error);
          return false;
        }
      },

      removeOrder: async (orderId) => {
        try {
          if (!isSupabaseConfigured() || !supabase) {
            set((state) => ({
              orders: state.orders.filter((order) => order.id !== orderId),
            }));
            return true;
          }

          const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', orderId);

          if (error) throw error;

          set((state) => ({
            orders: state.orders.filter((order) => order.id !== orderId),
          }));
          return true;
        } catch (error) {
          console.error('Error removing order:', error);
          return false;
        }
      },
    }),
    {
      name: 'order-storage',
    }
  )
);