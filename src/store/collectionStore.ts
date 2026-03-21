import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

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
  getRealProductCount: (category: string) => Promise<number>;
}

const uploadImage = async (file: File): Promise<string> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `collections/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    console.log('Uploading collection image:', fileName);

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

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
          const { data, error } = await supabase
            .from('collections')
            .select('*')
            .order('name');

          if (error) throw error;

          // Transform the data to match your interface (snake_case to camelCase)
          const collections: Collection[] = data.map(item => ({
            id: item.id,
            name: item.name,
            nameAr: item.name_ar,
            image: item.image,
            href: item.href,
            productCount: item.product_count
          }));

          set({ collections, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching collections:', error);
          set({ collections: [], error: error.message, isLoading: false });
        }
      },

      addCollection: async (collection) => {
        set({ isLoading: true, error: null });
        try {
          let imageUrl = collection.image;
          
          // Only upload if it's a new base64 image
          if (collection.image.startsWith('data:image')) {
            const response = await fetch(collection.image);
            const blob = await response.blob();
            const file = new File([blob], 'collection-image.jpg', { type: blob.type });
            imageUrl = await uploadImage(file);
          }
          
          // Transform to snake_case for database
          const collectionData = {
            name: collection.name,
            name_ar: collection.nameAr,
            image: imageUrl,
            href: collection.href,
            product_count: 0 // Initial count
          };
          
          const { error } = await supabase
            .from('collections')
            .insert([collectionData]);

          if (error) throw error;
          
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
          // Transform camelCase to snake_case for database
          const dbUpdates: any = {};
          
          if (updates.name) dbUpdates.name = updates.name;
          if (updates.nameAr) dbUpdates.name_ar = updates.nameAr;
          if (updates.image) dbUpdates.image = updates.image;
          if (updates.href) dbUpdates.href = updates.href;
          if (updates.productCount !== undefined) dbUpdates.product_count = updates.productCount;

          const { error } = await supabase
            .from('collections')
            .update(dbUpdates)
            .eq('id', id);

          if (error) throw error;
          
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
          // First, get the collection to delete its image
          const { data: collection, error: fetchError } = await supabase
            .from('collections')
            .select('image')
            .eq('id', id)
            .single();

          if (fetchError) throw fetchError;

          // Delete the image from storage if it exists
          if (collection?.image) {
            const imagePath = collection.image.split('/').pop();
            if (imagePath) {
              await supabase.storage
                .from('product-images')
                .remove([`collections/${imagePath}`]);
            }
          }

          // Delete the collection from database
          const { error } = await supabase
            .from('collections')
            .delete()
            .eq('id', id);

          if (error) throw error;
          
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
          collections: state.collections.map(c => 
            c.href.includes(category) 
              ? { ...c, productCount: count } 
              : c
          )
        }));

        // Also update in database
        const collection = get().collections.find(c => c.href.includes(category));
        if (collection) {
          supabase
            .from('collections')
            .update({ product_count: count })
            .eq('id', collection.id)
            .then(({ error }) => {
              if (error) console.error('Error updating product count:', error);
            });
        }
      },

  getRealProductCount: async (category) => {
    try {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category', category.replace('/products/', ''));

      if (error) {
        console.error('Error fetching product count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getRealProductCount:', error);
      return 0;
    }
  }
}),
    { 
      name: 'collection-storage',
      // Only persist non-sensitive data
      partialize: (state) => ({ 
        collections: state.collections 
      }) 
    }
  )
);