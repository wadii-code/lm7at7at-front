import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronRight,
  Minus,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useReviewStore } from '@/store/reviewStore';
import { ProductCard } from '@/components/ProductCard';
import { ReviewList } from '@/components/ReviewList';
import { ReviewForm } from '@/components/ReviewForm';
import { StarRating } from '@/components/StarRating';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getProductById, products } = useProductStore();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { reviews, fetchReviews } = useReviewStore();
  
  const product = getProductById(id || '');
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(0);
    }
    if (id) {
      fetchReviews(id);
    }
  }, [product, id, fetchReviews]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : product.rating;

  const reviewCount = reviews.length > 0 ? reviews.length : product.reviewCount;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor && product.colors.length > 0) {
      toast.error('Please select a color');
      return;
    }

    const colorToUse = selectedColor || product.colors[0]?.name || '';
    
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, colorToUse);
    }
    
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.descriptionAr,
        url: window.location.href,
      });
    } catch {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-primary">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
              <motion.img
                key={activeImage} // Animate when activeImage changes
                src={product.images[activeImage]}
                alt={product.name}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === idx
                        ? 'border-primary scale-105 shadow-md'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - thumbnail ${idx + 1}`}
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
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={averageRating} />
                  <span className="font-bold">{averageRating.toFixed(1)}</span>
                  <a href="#reviews" className="text-gray-500 hover:underline">
                    ({reviewCount} reviews)
                  </a>
                </div>
                {product.isNew && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    New
                  </span>
                )}
                {product.isOnSale && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    Sale
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  Save ${product.originalPrice - product.price}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            <div>
              <label className="block font-bold text-gray-900 mb-3">
                Size: <span className="text-primary">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 ? (
              <div>
                <label className="block font-bold text-gray-900 mb-3">
                  Color: <span className="text-primary">{selectedColor || 'Select color'}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === color.name
                          ? 'border-primary scale-110 shadow-md'
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm p-4 bg-gray-50 rounded-lg">
                No color options available for this product
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center border-2 border-gray-200 rounded-lg">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-3 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button onClick={handleAddToCart} size="lg" className="flex-1">
                Add to Cart
              </Button>
            </div>

            {/* Wishlist & Share */}
            <div className="flex items-center gap-4">
              <Button 
                variant="outline"
                onClick={() => toggleWishlist(product.id!)}
                className="flex-1"
              >
                <Heart className={`w-5 h-5 mr-2 ${isInWishlist(product.id || '') ? 'fill-red-500 text-red-500' : ''}`} />
                {isInWishlist(product.id || '') ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
              <Button variant="outline" onClick={handleShare} className="flex-1">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>

            {/* Guarantees */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-gray-700">Free & Fast Shipping</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Customer Reviews */}
        <div id="reviews" className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <ReviewList reviews={reviews} />
            </div>
            <div className="md:col-span-1">
              <ReviewForm productId={id!} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}