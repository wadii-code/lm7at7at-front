import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  title: string;
  titleAr: string;
  products: Product[];
  viewAllLink?: string;
  id?: string;
}

export function ProductGrid({ title, titleAr, products, viewAllLink, id }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <section id={id} className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {titleAr} / {title}
          </h2>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
            >
              عرض الكل
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
