import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useProductStore } from '@/store/productStore';

export function FeaturedProducts() {
  const { products } = useProductStore();
  
  const featuredProduct = products.find((p) => p.isBestseller);
  
  if (!featuredProduct) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="text-secondary font-bold">المنتج المميز</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              {featuredProduct.nameAr}
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              {featuredProduct.descriptionAr}
            </p>
            
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                {featuredProduct.price} درهم
              </span>
              {featuredProduct.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {featuredProduct.originalPrice} درهم
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {featuredProduct.sizes.map((size) => (
                <span
                  key={size}
                  className="bg-white px-4 py-2 rounded-lg font-medium shadow-sm"
                >
                  {size}
                </span>
              ))}
            </div>

            <Link to={`/product/${featuredProduct.id}`}>
              <button className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-full transition-colors flex items-center gap-2 mt-4">
                اشتري الآن
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={featuredProduct.images[0]}
                alt={featuredProduct.nameAr}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-secondary text-gray-900 font-bold px-6 py-3 rounded-full shadow-lg">
              الأكثر مبيعاً ⭐
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}