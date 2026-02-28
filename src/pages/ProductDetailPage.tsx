import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw, 
  Star,
  ChevronRight,
  Minus,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ProductCard } from '@/components/ProductCard';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getProductById, products } = useProductStore();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  
  const product = getProductById(id || '');
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            المنتج غير موجود
          </h1>
          <Link to="/products">
            <Button>العودة للمنتجات</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('الرجاء اختيار المقاس');
      return;
    }
    if (!selectedColor && product.colors.length > 0) {
      toast.error('الرجاء اختيار اللون');
      return;
    }

    const colorToUse = selectedColor || product.colors[0]?.name || '';
    
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, colorToUse);
    }
    
    toast.success(`تمت إضافة ${quantity} ${product.nameAr} إلى السلة`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.nameAr,
        text: product.descriptionAr,
        url: window.location.href,
      });
    } catch {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('تم نسخ الرابط');
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary">الرئيسية</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-primary">المنتجات</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{product.nameAr}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <img
                src={product.images[activeImage]}
                alt={product.nameAr}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage === idx
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.nameAr} - ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.nameAr}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-gray-500">
                    ({product.reviewCount} تقييم)
                  </span>
                </div>
                {product.isNew && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    جديد
                  </span>
                )}
                {product.isOnSale && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    خصم
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                {product.price} درهم
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {product.originalPrice} درهم
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  وفّر {product.originalPrice - product.price} درهم
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.descriptionAr}
            </p>

            {/* Size Selection */}
            <div>
              <label className="block font-bold text-gray-900 mb-3">
                المقاس: <span className="text-primary">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <label className="block font-bold text-gray-900 mb-3">
                  اللون: <span className="text-primary">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-primary ring-2 ring-primary ring-offset-2'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.nameAr}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block font-bold text-gray-900 mb-3">
                الكمية
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary-dark text-white py-6 text-lg font-bold"
              >
                أضف إلى السلة
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 ${
                  isInWishlist(product.id)
                    ? 'text-red-500 border-red-500'
                    : ''
                }`}
              >
                <Heart
                  className="w-6 h-6"
                  fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                />
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="w-14 h-14"
              >
                <Share2 className="w-6 h-6" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-gray-600">توصيل سريع</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-gray-600">جودة مضمونة</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-gray-600">إرجاع سهل</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent">
              <TabsTrigger value="description" className="text-lg">
                الوصف
              </TabsTrigger>
              <TabsTrigger value="details" className="text-lg">
                التفاصيل
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-lg">
                التقييمات ({product.reviewCount})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.descriptionAr}
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  {product.description}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-4">معلومات المنتج</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">التصنيف:</span>
                      <span className="font-medium">{product.category}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">المقاسات المتوفرة:</span>
                      <span className="font-medium">{product.sizes.join(', ')}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">الألوان:</span>
                      <span className="font-medium">
                        {product.colors.map((c) => c.nameAr).join(', ')}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">المخزون:</span>
                      <span className="font-medium">
                        {product.inStock ? 'متوفر' : 'غير متوفر'}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-4">الوسوم</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-white px-3 py-1 rounded-full text-sm text-gray-600 border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="text-center py-12">
                <p className="text-gray-500">
                  تقييم المستخدمين قريباً...
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              منتجات مشابهة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
