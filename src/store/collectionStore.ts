import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useProductStore } from './productStore';

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
  
  // Collection actions
  addCollection: (collection: Omit<Collection, 'id' | 'productCount'>) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  getCollectionById: (id: string) => Collection | undefined;
  updateProductCount: (category: string, count: number) => void;
  getRealProductCount: (category: string) => number;
}

const sampleCollections: Collection[] = [
  {
    id: 'col1',
    name: 'Basic Tees',
    nameAr: 'تيشيرتات أساسية',
    image: '/images/1.jpeg',
    href: '/products/basic',
    productCount: 0,
  },
  {
    id: 'col2',
    name: 'Graphic Tees',
    nameAr: 'تيشيرتات جرافيك',
    image: '/images/2.jpeg',
    href: '/products/graphic',
    productCount: 0,
  },
  {
    id: 'col3',
    name: 'Sport Tees',
    nameAr: 'تيشيرتات رياضية',
    image: '/images/red.jpeg',
    href: '/products/sport',
    productCount: 0,
  },
  {
    id: 'col4',
    name: 'Polo Shirts',
    nameAr: 'قمصان بولو',
    image: '/images/white.jpeg',
    href: '/products/polo',
    productCount: 0,
  },
];

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      collections: sampleCollections,

      addCollection: (collection) => {
        const newCollection: Collection = {
          ...collection,
          id: `col_${Date.now()}`,
          productCount: 0,
        };
        set((state) => ({
          collections: [...state.collections, newCollection],
        }));
      },

      updateCollection: (id, updates) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        }));
      },

      getCollectionById: (id) => {
        return get().collections.find((c) => c.id === id);
      },

      updateProductCount: (category, count) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.href === `/products/${category}` 
              ? { ...c, productCount: count } 
              : c
          ),
        }));
      },

      getRealProductCount: (category) => {
        // Get the actual product count from productStore based on category
        const products = useProductStore.getState().products;
        return products.filter((p) => p.category === category).length;
      },
    }),
    {
      name: 'collection-store',
    }
  )
);

