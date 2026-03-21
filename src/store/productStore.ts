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
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getFilteredProducts: () => Product[];
  setSearchQuery: (query: string) => void;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<boolean>;
  getProductReviews: (productId: string) => Review[];
  fetchReviews: (productId: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}

// Helper function to transform database snake_case to camelCase
const transformProductFromDB = (dbProduct: any): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  nameAr: dbProduct.name_ar,
  description: dbProduct.description,
  descriptionAr: dbProduct.description_ar,
  price: dbProduct.price,
  originalPrice: dbProduct.original_price,
  images: dbProduct.images || [],
  thumbnail: dbProduct.thumbnail,
  category: dbProduct.category,
  subcategory: dbProduct.subcategory,
  sizes: dbProduct.sizes || [],
  colors: dbProduct.product_colors || [],
  inStock: dbProduct.in_stock,
  stockQuantity: dbProduct.stock_quantity,
  rating: dbProduct.rating,
  reviewCount: dbProduct.review_count,
  tags: dbProduct.tags || [],
  isNew: dbProduct.is_new,
  isBestseller: dbProduct.is_bestseller,
  isOnSale: dbProduct.is_on_sale,
  createdAt: dbProduct.created_at,
});

// Helper function to transform camelCase to snake_case for database
const transformProductForDB = (product: Partial<Product>) => {
  const dbProduct: any = {};
  
  if (product.name !== undefined) dbProduct.name = product.name;
  if (product.nameAr !== undefined) dbProduct.name_ar = product.nameAr;
  if (product.description !== undefined) dbProduct.description = product.description;
  if (product.descriptionAr !== undefined) dbProduct.description_ar = product.descriptionAr;
  if (product.price !== undefined) dbProduct.price = product.price;
  if (product.originalPrice !== undefined) dbProduct.original_price = product.originalPrice;
  if (product.images !== undefined) dbProduct.images = product.images;
  if (product.thumbnail !== undefined) dbProduct.thumbnail = product.thumbnail;
  if (product.category !== undefined) dbProduct.category = product.category;
  if (product.subcategory !== undefined) dbProduct.subcategory = product.subcategory;
  if (product.sizes !== undefined) dbProduct.sizes = product.sizes;
  if (product.inStock !== undefined) dbProduct.in_stock = product.inStock;
  if (product.stockQuantity !== undefined) dbProduct.stock_quantity = product.stockQuantity;
  if (product.rating !== undefined) dbProduct.rating = product.rating;
  if (product.reviewCount !== undefined) dbProduct.review_count = product.reviewCount;
  if (product.tags !== undefined) dbProduct.tags = product.tags;
  if (product.isNew !== undefined) dbProduct.is_new = product.isNew;
  if (product.isBestseller !== undefined) dbProduct.is_bestseller = product.isBestseller;
  if (product.isOnSale !== undefined) dbProduct.is_on_sale = product.isOnSale;
  
  return dbProduct;
};

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
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_colors (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform snake_case to camelCase
      const products: Product[] = data.map(transformProductFromDB);
      
      set({ products, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      set({ products: [], error: error.message, isLoading: false });
    }
  },

  addProduct: async (product) => {
    set({ isLoading: true, error: null });
    try {
      // Transform to snake_case for database
      const productData = transformProductForDB(product);
      
      // Add default values
      productData.created_at = new Date().toISOString();
      productData.rating = 0;
      productData.review_count = 0;
      
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) throw error;
      
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
      // Transform camelCase to snake_case
      const dbUpdates = transformProductForDB(updates);

      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      
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
      // First, get the product to delete its images
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('images, thumbnail')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Delete images from storage
      if (product?.images && product.images.length > 0) {
        const imagePaths = product.images.map((url: string) => {
          const path = url.split('/').pop();
          return `products/${path}`;
        });
        
        await supabase.storage
          .from('product-images')
          .remove(imagePaths);
      }

      // Delete thumbnail if it exists and is different from images
      if (product?.thumbnail && !product.images.includes(product.thumbnail)) {
        const thumbnailPath = `products/${product.thumbnail.split('/').pop()}`;
        await supabase.storage
          .from('product-images')
          .remove([thumbnailPath]);
      }

      // Delete the product from database (this will cascade to related tables)
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
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
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
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
          p.description.toLowerCase().includes(query) ||
          p.descriptionAr.toLowerCase().includes(query) ||
          (p.tags && p.tags.some((tag: string) => tag.toLowerCase().includes(query)))
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
        p.sizes && p.sizes.some((size: string) => filters.sizes!.includes(size))
      );
    }

    if (filters.colors && filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors && p.colors.some((color: any) => 
          typeof color === 'string' 
            ? filters.colors!.includes(color)
            : filters.colors!.includes(color.name)
        )
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
      // Transform to snake_case for database
      const reviewData = {
        product_id: review.productId,
        user_name: review.userName,
        rating: review.rating,
        comment: review.comment,
        comment_ar: review.commentAr,
        images: review.images || [],
        verified: review.verified || false,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('reviews')
        .insert([reviewData]);

      if (error) throw error;

      // Update product rating and review count
      const { data: reviews, error: fetchError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', review.productId);

      if (!fetchError && reviews) {
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        await supabase
          .from('products')
          .update({ 
            rating: averageRating,
            review_count: reviews.length 
          })
          .eq('id', review.productId);
      }
      
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
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform snake_case to camelCase
      const reviews: Review[] = data.map(item => ({
        id: item.id,
        productId: item.product_id,
        user: item.user, // Assuming 'user' is a populated object from your DB
        userName: item.user_name,
        rating: item.rating,
        comment: item.comment,
        commentAr: item.comment_ar,
        images: item.images || [],
        verified: item.verified,
        createdAt: item.created_at,
      }));

      set({ reviews, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      set({ error: error.message, isLoading: false });
    }
  },
}));