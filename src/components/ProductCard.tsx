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
    
    if (!product.id) return;

    if (product.stockQuantity === 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    // Add with default size and color
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0]?.name || '';
    
    addItem(product, defaultSize, defaultColor);
    toast.success(`تمت إضافة ${product.nameAr} إلى السلة`);
  };


  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.id) return;
    
    toggleWishlist(product.id);
    
    const isCurrentlyInWishlist = isInWishlist(product.id);
    toast.success(
      isCurrentlyInWishlist
        ? `تمت إزالة ${product.nameAr} من قائمة الرغبات`
        : `تمت إضافة ${product.nameAr} إلى قائمة الرغبات`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="bg-card text-card-foreground rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
          {/* Image */}
          <div className="relative aspect-square bg-muted/50 overflow-hidden">
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
              {product.stockQuantity === 0 && (
                <span className="bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Out of stock
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
            onClick={handleWishlistToggle}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
              product.id && isInWishlist(product.id)
                ? 'bg-red-500 text-white'
                : 'bg-card text-card-foreground hover:bg-muted'
            }`}
            aria-label="Toggle Wishlist"
          >
            <Heart className="w-5 h-5" fill={product.id && isInWishlist(product.id) ? 'currentColor' : 'none'} />
          </button>
              <button
                className="w-10 h-10 bg-card text-card-foreground rounded-full flex items-center justify-center hover:bg-muted transition-colors"
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
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {product.category}
            </p>

            {/* Title */}
            <h3 className="font-bold text-card-foreground mb-2 line-clamp-2 min-h-[48px]">
              {product.nameAr}
            </h3>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
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
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice.toFixed(2)} درهم
                </span>
              )}
            </div>

            {/* Sizes */}
            <div className="flex flex-wrap gap-1 mt-3">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="text-xs bg-muted px-2 py-1 rounded"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs bg-muted px-2 py-1 rounded">
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