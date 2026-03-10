export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  images: string[];
  thumbnail?: string; // Separate image for main page display
  category: string;
  subcategory?: string;
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

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Collection {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  href: string;
  productCount: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  commentAr: string;
  date: string;
  images?: string[];
  verified: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  wishlist: string[];
  orders: string[];
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'bestseller' | 'rating';
}
