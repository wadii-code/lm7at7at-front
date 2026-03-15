import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';


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


const uploadImage = async (file: File): Promise<string> => {
  // Check if Supabase is configured
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `collections/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    console.log('Uploading collection image:', fileName);

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('product-images') // Using the same bucket as products
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);
    
    console.log('Image uploaded successfully:', data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};


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

  // In your collection store
  addCollection: async (collection) => {
    set({ isLoading: true, error: null });
    try {
      // If collection.image is a base64 string, upload it first
      let imageUrl = collection.image;
      
      if (collection.image.startsWith('data:image')) {
        // Convert base64 to blob and upload
        const response = await fetch(collection.image);
        const blob = await response.blob();
        const file = new File([blob], 'collection-image.jpg', { type: 'image/jpeg' });
        
        // Use your existing uploadImage function
        imageUrl = await uploadImage(file);
      }
      
      // Send only the URL, not the base64
      const collectionData = {
        ...collection,
        image: imageUrl
      };
      
      const response = await fetch(`${API_URL}/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionData),
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