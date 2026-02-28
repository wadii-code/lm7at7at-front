import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Review, FilterOptions } from '@/types';

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: { name: string; nameAr: string; hex: string }[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  isOnSale?: boolean;
  createdAt: string;
}

interface ProductState {
  products: Product[];
  reviews: Review[];
  searchQuery: string;
  filters: FilterOptions;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getFilteredProducts: () => Product[];
  
  // Search & Filter actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  
  // Review actions
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  getProductReviews: (productId: string) => Review[];
  
  // Initialize with sample data
  initializeProducts: () => void;
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt White',
    nameAr: 'تيشيرت قطن ممتاز أبيض',
    description: 'High-quality 100% cotton t-shirt with a comfortable fit. Perfect for everyday wear with excellent breathability and softness.',
    descriptionAr: 'تيشيرت قطن 100% عالي الجودة بقصة مريحة. مثالي للاستخدام اليومي مع تهوية ونعومة ممتازة.',
    price: 249,
    images: ['/images/tshirt-white.jpg'],
    category: 'basic',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'White', nameAr: 'أبيض', hex: '#FFFFFF' }],
    inStock: true,
    stockQuantity: 50,
    rating: 4.8,
    reviewCount: 124,
    tags: ['cotton', 'basic', 'white', 'premium'],
    isBestseller: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Premium Cotton T-Shirt Black',
    nameAr: 'تيشيرت قطن ممتاز أسود',
    description: 'Classic black cotton t-shirt with premium quality fabric. Durable, comfortable, and perfect for any occasion.',
    descriptionAr: 'تيشيرت قطن أسود كلاسيكي بقماش عالي الجودة. متين ومريح ومثالي لجميع المناسبات.',
    price: 249,
    images: ['/images/tshirt-black.jpg'],
    category: 'basic',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Black', nameAr: 'أسود', hex: '#000000' }],
    inStock: true,
    stockQuantity: 45,
    rating: 4.7,
    reviewCount: 98,
    tags: ['cotton', 'basic', 'black', 'premium'],
    isBestseller: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Geometric Graphic T-Shirt',
    nameAr: 'تيشيرت جرافيك هندسي',
    description: 'Stylish white t-shirt featuring a vibrant geometric print. Made from soft, breathable cotton for all-day comfort.',
    descriptionAr: 'تيشيرت أبيض أنيق يتميز بطباعة هندسية نابضة بالحياة. مصنوع من قطن ناعم وقابل للتنفس للراحة طوال اليوم.',
    price: 279,
    images: ['/images/tshirt-graphic.jpg'],
    category: 'graphic',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'White', nameAr: 'أبيض', hex: '#FFFFFF' }],
    inStock: true,
    stockQuantity: 30,
    rating: 4.9,
    reviewCount: 67,
    tags: ['graphic', 'colorful', 'trendy', 'streetwear'],
    isNew: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Navy Blue Classic T-Shirt',
    nameAr: 'تيشيرت كلاسيكي كحلي',
    description: 'Elegant navy blue t-shirt with a classic fit. Versatile piece that pairs well with jeans or chinos.',
    descriptionAr: 'تيشيرت كحلي أنيق بقصة كلاسيكية. قطعة متعددة الاستخدامات تتناسب جيداً مع الجينز أو الشينو.',
    price: 229,
    images: ['/images/tshirt-navy.jpg'],
    category: 'basic',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Navy', nameAr: 'كحلي', hex: '#1a365d' }],
    inStock: true,
    stockQuantity: 35,
    rating: 4.6,
    reviewCount: 45,
    tags: ['cotton', 'classic', 'navy', 'versatile'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Vintage Grey Heather T-Shirt',
    nameAr: 'تيشيرت فينتاج رمادي',
    description: 'Retro-inspired heather grey t-shirt with a vintage wash finish. Soft, worn-in feel from day one.',
    descriptionAr: 'تيشيرت رمادي هيثر مستوحى من الطراز القديم مع لمسة فينتاج. ناعم ومريح من اليوم الأول.',
    price: 259,
    images: ['/images/tshirt-grey.jpg'],
    category: 'basic',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Grey', nameAr: 'رمادي', hex: '#9CA3AF' }],
    inStock: true,
    stockQuantity: 25,
    rating: 4.5,
    reviewCount: 38,
    tags: ['vintage', 'heather', 'grey', 'retro'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Oversized Beige T-Shirt',
    nameAr: 'تيشيرت أوفرسايز بيج',
    description: 'Trendy oversized t-shirt in a neutral beige tone. Relaxed fit perfect for casual streetwear looks.',
    descriptionAr: 'تيشيرت أوفرسايز عصري بلون بيج محايد. قصة مريحة مثالية للإطلالات الكاجوال.',
    price: 289,
    images: ['/images/tshirt-beige.jpg'],
    category: 'trendy',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Beige', nameAr: 'بيج', hex: '#D4C4B0' }],
    inStock: true,
    stockQuantity: 20,
    rating: 4.7,
    reviewCount: 52,
    tags: ['oversized', 'beige', 'trendy', 'streetwear'],
    isNew: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Performance Sport T-Shirt',
    nameAr: 'تيشيرت رياضي بيرفورمانس',
    description: 'High-performance athletic t-shirt with moisture-wicking technology. Keeps you cool and dry during workouts.',
    descriptionAr: 'تيشيرت رياضي عالي الأداء بتقنية إزالة العرق. يحافظ على برودتك وجفافك أثناء التمرين.',
    price: 299,
    originalPrice: 349,
    images: ['/images/tshirt-sport.jpg'],
    category: 'sport',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Black', nameAr: 'أسود', hex: '#000000' }],
    inStock: true,
    stockQuantity: 40,
    rating: 4.8,
    reviewCount: 89,
    tags: ['sport', 'performance', 'dry-fit', 'athletic'],
    isOnSale: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Dry-Fit Training T-Shirt',
    nameAr: 'تيشيرت تدريب دراي فت',
    description: 'Lightweight training t-shirt with advanced dry-fit technology. Perfect for gym sessions and outdoor activities.',
    descriptionAr: 'تيشيرت تدريب خفيف الوزن بتقنية دراي فت المتقدمة. مثالي لجلسات الصالة الرياضية والأنشطة الخارجية.',
    price: 279,
    originalPrice: 329,
    images: ['/images/tshirt-dryfit.jpg'],
    category: 'sport',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'White', nameAr: 'أبيض', hex: '#FFFFFF' }],
    inStock: true,
    stockQuantity: 35,
    rating: 4.6,
    reviewCount: 56,
    tags: ['sport', 'training', 'dry-fit', 'gym'],
    isOnSale: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Wanderlust Retro Graphic Tee',
    nameAr: 'تيشيرت جرافيك ريترو',
    description: 'Black t-shirt featuring a vintage sunset graphic design. Perfect for adventure lovers and travel enthusiasts.',
    descriptionAr: 'تيشيرت أسود يتميز بتصميم غروب الشمس الكلاسيكي. مثالي لمحبي المغامرة وعشاق السفر.',
    price: 269,
    images: ['/images/tshirt-retro.jpg'],
    category: 'graphic',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Black', nameAr: 'أسود', hex: '#000000' }],
    inStock: true,
    stockQuantity: 28,
    rating: 4.9,
    reviewCount: 73,
    tags: ['graphic', 'retro', 'vintage', 'travel'],
    isBestseller: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Classic V-Neck T-Shirt',
    nameAr: 'تيشيرت في نيك كلاسيك',
    description: 'Sophisticated black v-neck t-shirt with a modern slim fit. Elevates your casual wardrobe effortlessly.',
    descriptionAr: 'تيشيرت في نيك أسود أنيق بقصة ضيقة عصرية. يرقي خزانة ملابسك الكاجوال بسهولة.',
    price: 239,
    images: ['/images/tshirt-vneck.jpg'],
    category: 'classic',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Black', nameAr: 'أسود', hex: '#000000' }],
    inStock: true,
    stockQuantity: 32,
    rating: 4.5,
    reviewCount: 41,
    tags: ['classic', 'v-neck', 'slim-fit', 'elegant'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'Premium Polo Shirt White',
    nameAr: 'قميص بولو أبيض ممتاز',
    description: 'Classic white polo shirt with premium pique cotton fabric. Perfect for smart-casual occasions.',
    descriptionAr: 'قميص بولو أبيض كلاسيكي بقماش بيكيه قطني ممتاز. مثالي للمناسبات الذكية الكاجوال.',
    price: 349,
    images: ['/images/polo-white.jpg'],
    category: 'polo',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'White', nameAr: 'أبيض', hex: '#FFFFFF' }],
    inStock: true,
    stockQuantity: 22,
    rating: 4.7,
    reviewCount: 48,
    tags: ['polo', 'classic', 'smart-casual', 'premium'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '12',
    name: 'Abstract Art Graphic Tee',
    nameAr: 'تيشيرت جرافيك فن تجريدي',
    description: 'White t-shirt featuring a bold abstract art print. Express your artistic side with this unique design.',
    descriptionAr: 'تيشيرت أبيض يتميز بطباعة فن تجريدي جريئة. عبر عن جانبك الفني مع هذا التصميم الفريد.',
    price: 289,
    images: ['/images/tshirt-graphic.jpg'],
    category: 'graphic',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'White', nameAr: 'أبيض', hex: '#FFFFFF' }],
    inStock: true,
    stockQuantity: 18,
    rating: 4.8,
    reviewCount: 34,
    tags: ['graphic', 'abstract', 'art', 'unique'],
    isNew: true,
    createdAt: new Date().toISOString(),
  },
];

const sampleReviews: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userName: 'Ahmed M.',
    rating: 5,
    comment: 'Excellent quality! The fabric is so soft and comfortable. Will definitely buy more.',
    commentAr: 'جودة ممتازة! القماش ناعم ومريح جداً. سأشتري المزيد بالتأكيد.',
    date: new Date().toISOString(),
    verified: true,
  },
  {
    id: 'r2',
    productId: '1',
    userName: 'Sara K.',
    rating: 5,
    comment: 'Perfect fit and great quality. The color stays vibrant even after multiple washes.',
    commentAr: 'قصة مثالية وجودة رائعة. اللون يبقى نابضاً بالحياة حتى بعد غسلات متعددة.',
    date: new Date().toISOString(),
    verified: true,
  },
  {
    id: 'r3',
    productId: '2',
    userName: 'Karim B.',
    rating: 4,
    comment: 'Good quality t-shirt. The black color is deep and doesnt fade easily.',
    commentAr: 'تيشيرت جيد الجودة. اللون الأسود عميق ولا يبهت بسهولة.',
    date: new Date().toISOString(),
    verified: true,
  },
  {
    id: 'r4',
    productId: '3',
    userName: 'Leila H.',
    rating: 5,
    comment: 'Love the graphic design! Gets lots of compliments when I wear it.',
    commentAr: 'أحب التصميم الجرافيكي! أحصل على الكثير من الإطراءات عندما أرتديه.',
    date: new Date().toISOString(),
    verified: true,
  },
  {
    id: 'r5',
    productId: '7',
    userName: 'Youssef A.',
    rating: 5,
    comment: 'Best sport t-shirt Ive ever owned. Keeps me dry during intense workouts.',
    commentAr: 'أفضل تيشيرت رياضي امتلكته على الإطلاق. يحافظ على جفافي أثناء التمارين المكثفة.',
    date: new Date().toISOString(),
    verified: true,
  },
];

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: sampleProducts,
      reviews: sampleReviews,
      searchQuery: '',
      filters: {},

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
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

        // Apply search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          result = result.filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              p.nameAr.toLowerCase().includes(query) ||
              p.description.toLowerCase().includes(query) ||
              p.tags.some((tag) => tag.toLowerCase().includes(query))
          );
        }

        // Apply category filter
        if (filters.category) {
          result = result.filter((p) => p.category === filters.category);
        }

        // Apply price filters
        if (filters.minPrice !== undefined) {
          result = result.filter((p) => p.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
          result = result.filter((p) => p.price <= filters.maxPrice!);
        }

        // Apply size filter
        if (filters.sizes && filters.sizes.length > 0) {
          result = result.filter((p) =>
            p.sizes.some((size) => filters.sizes!.includes(size))
          );
        }

        // Apply color filter
        if (filters.colors && filters.colors.length > 0) {
          result = result.filter((p) =>
            p.colors.some((color) => filters.colors!.includes(color.name))
          );
        }

        // Apply sorting
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
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
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

      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        };
        set((state) => ({
          reviews: [...state.reviews, newReview],
        }));
      },

      getProductReviews: (productId) => {
        return get().reviews.filter((r) => r.productId === productId);
      },

      initializeProducts: () => {
        // Products are already initialized in the store
      },
    }),
    {
      name: 'product-store',
    }
  )
);