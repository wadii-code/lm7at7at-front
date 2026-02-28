import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/store/wishlistStore';
import { useProductStore } from '@/store/productStore';
import { ProductCard } from '@/components/ProductCard';

export function WishlistPage() {
  const { items: wishlistItems, clearWishlist } = useWishlistStore();
  const { products } = useProductStore();

  const wishlistProducts = products.filter((p) =>
    wishlistItems.includes(p.id)
  );

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Heart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            قائمة المفضلة فارغة
          </h1>
          <p className="text-gray-500 mb-8">
            أضف منتجاتك المفضلة للعودة إليها لاحقاً
          </p>
          <Link to="/products">
            <Button className="bg-primary hover:bg-primary-dark text-white px-8">
              تصفح المنتجات
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                قائمة المفضلة
              </h1>
              <p className="text-gray-600 mt-1">
                {wishlistProducts.length} منتج في قائمة المفضلة
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/products">
                <Button variant="outline">
                  <ShoppingBag className="w-4 h-4 ml-2" />
                  مواصلة التسوق
                </Button>
              </Link>
              <Button variant="outline" onClick={clearWishlist}>
                <Heart className="w-4 h-4 ml-2" />
                إفراغ القائمة
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
