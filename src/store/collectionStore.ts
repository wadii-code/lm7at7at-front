import { create } from 'zustand';
import { persist } from 'zustand/middleware';


const API_URL = 'http://localhost:3001/api';

/** 
 * Note: The error "Cannot find module '@/lib/supabase'" usually occurs 
 * because the path alias '@' is not correctly resolved by the TypeScript 
 * compiler or the file does not exist. 
 * 
 * To fix this permanently:
 * 1. Ensure src/lib/supabase.ts exists.
 * 2. Check tsconfig.json for "paths": { "@/*": ["./src/*"] }
 */

interface Collection {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  href: string;
  productCount: number;
}

interface CollectionState {
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
  
  fetchCollections: () => Promise<void>;
  addCollection: (collection: Omit<Collection, 'id' | 'productCount'>) => Promise<boolean>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<boolean>;
  deleteCollection: (id: string) => Promise<boolean>;
  getCollectionById: (id: string) => Collection | undefined;
  updateProductCount: (category: string, count: number) => void;
  getRealProductCount: (category: string) => number;
}






export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      collections: [],
      isLoading: false,
      error: null,

  fetchCollections: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/collections`);
          if (!response.ok) throw new Error('Failed to fetch collections');
          const collections: Collection[] = await response.json();
          set({ collections, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching collections:', error);
          set({ collections: [], error: error.message, isLoading: false });
        }
      },

      addCollection: async (collection) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/collections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(collection),
          });
          if (!response.ok) throw new Error('Failed to add collection');
          await get().fetchCollections();
          return true;
        } catch (error: any) {
          console.error('Error adding collection:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      updateCollection: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/collections/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          });
          if (!response.ok) throw new Error('Failed to update collection');
          await get().fetchCollections();
          return true;
        } catch (error: any) {
          console.error('Error updating collection:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      deleteCollection: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/collections/${id}`, {
            method: 'DELETE',
          });
          if (!response.ok) throw new Error('Failed to delete collection');
          await get().fetchCollections();
          return true;
        } catch (error: any) {
          console.error('Error deleting collection:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      getCollectionById: (id) => get().collections.find(c => c.id === id),

      updateProductCount: (category, count) => {
        set((state) => ({
          collections: state.collections.map(c => c.href.includes(category) ? { ...c, productCount: count } : c)
        }));
      },

      getRealProductCount: (category) => {
        return get().collections.find(c => c.href.includes(category))?.productCount || 0;
      },
    }),
    { name: 'collection-storage' }
  )
);