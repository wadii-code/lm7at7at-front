import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add with default size and color
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0]?.name || '';
    
    addItem(product, defaultSize, defaultColor);
    toast.success(`تمت إضافة ${product.nameAr} إلى السلة`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    
    if (isInWishlist(product.id)) {
      toast.success('تمت إزالة المنتج من المفضلة');
    } else {
      toast.success('تمت إضافة المنتج إلى المفضلة');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
          {/* Image */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            <img
              src={product.thumbnail || product.images[0]}
              alt={product.nameAr}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  جديد
                </span>
              )}
              {product.isOnSale && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  خصم
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  الأكثر مبيعاً
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleWishlist}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-5 h-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </button>
              <button
                className="w-10 h-10 bg-white text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Add Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
              <Button
                onClick={handleQuickAdd}
                className="w-full bg-primary hover:bg-primary-dark text-white"
              >
                <ShoppingCart className="w-4 h-4 ml-2" />
                إضافة سريعة
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.category}
            </p>

            {/* Title */}
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[48px]">
              {product.nameAr}
            </h3>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount})
                </span>
              </div>
            )}
            
            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {product.price.toFixed(2)} درهم
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice.toFixed(2)} درهم
                </span>
              )}
            </div>

            {/* Sizes */}
            <div className="flex flex-wrap gap-1 mt-3">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}