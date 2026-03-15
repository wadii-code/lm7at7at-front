import { create } from 'zustand';
import type { Review, FilterOptions } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Product } from '@/types';


interface ProductState {
  products: Product[];
  reviews: Review[];
  searchQuery: string;
  filters: FilterOptions;
  isLoading: boolean;
  error: string | null;
  
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getFilteredProducts: () => Product[];
  setSearchQuery: (query: string) => void;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<boolean>;
  getProductReviews: (productId: string) => Review[];
  fetchReviews: (productId: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}

const API_URL = 'http://localhost:3001/api';

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  reviews: [],
  searchQuery: '',
  filters: {},
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const snakeCaseProducts = await response.json();
      
      // Transform snake_case to camelCase
      const products: Product[] = snakeCaseProducts.map((product: any) => ({
        id: product.id,
        name: product.name,
        nameAr: product.name_ar,
        description: product.description,
        descriptionAr: product.description_ar,
        price: product.price,
        originalPrice: product.original_price,
        images: product.images,
        thumbnail: product.thumbnail,
        category: product.category,
        subcategory: product.subcategory,
        sizes: product.sizes,
        colors: product.colors,
        inStock: product.in_stock,
        stockQuantity: product.stock_quantity,
        rating: product.rating,
        reviewCount: product.review_count,
        tags: product.tags,
        isNew: product.is_new,
        isBestseller: product.is_bestseller,
        isOnSale: product.is_on_sale,
        createdAt: product.created_at,
      }));
      
      set({ products, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      set({ products: [], error: error.message, isLoading: false });
    }
  },

  addProduct: async (product) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to add product');
      await get().fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error adding product:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  updateProduct: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update product');
      await get().fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error updating product:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      await get().fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  uploadImage: async (file: File): Promise<string> => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log('Uploading to path:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      console.log('Public URL:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Full upload error:', error);
      throw error;
    }
  },

  getProductById: (id) => {
    return get().products.find((p) => p.id === id);
  },

  getProductsByCategory: (category) => {
    return get().products.filter((p) => p.category === category);
  },

  getFilteredProducts: () => {
    const { products, searchQuery, filters } = get();
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.nameAr && p.nameAr.toLowerCase().includes(query)) ||
          p.descriptionAr.toLowerCase().includes(query) ||
          p.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.sizes && filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((size: string) => filters.sizes!.includes(size))
      );
    }

    if (filters.colors && filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((color: { name: string }) => filters.colors!.includes(color.name))
      );
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          result.sort(
            (a, b) =>
              new Date(b.createdAt!).getTime() -
              new Date(a.createdAt!).getTime()
          );
          break;
        case 'bestseller':
          result.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    return result;
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  clearFilters: () => set({ filters: {}, searchQuery: '' }),

  addReview: async (review) => {
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });

      if (!response.ok) throw new Error('Failed to add review');
      
      await get().fetchReviews(review.productId);
      await get().fetchProducts(); // Refetch products to update review counts/ratings

      return true;
    } catch (error: any) {
      console.error('Error adding review:', error);
      return false;
    }
  },

  getProductReviews: (productId) => {
    return get().reviews.filter((r) => r.productId === productId);
  },

  fetchReviews: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/products/${productId}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');

      const reviews: Review[] = await response.json();
      set({ reviews, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      set({ error: error.message, isLoading: false });
    }
  },
}));