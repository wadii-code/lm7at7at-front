import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// Generate placeholder review images using the product images
const reviews = [
  { id: 1, image: '/images/tshirt-white.jpg', rating: 5 },
  { id: 2, image: '/images/tshirt-black.jpg', rating: 5 },
  { id: 3, image: '/images/tshirt-graphic.jpg', rating: 5 },
  { id: 4, image: '/images/tshirt-navy.jpg', rating: 5 },
  { id: 5, image: '/images/tshirt-grey.jpg', rating: 5 },
  { id: 6, image: '/images/tshirt-beige.jpg', rating: 5 },
];

export function CustomerReviews() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-page-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            آراء زبائننا 📢
          </h2>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-card">
                <img
                  src={review.image}
                  alt={`Review ${review.id}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                />
              </div>
              {/* Rating Stars */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-white/90 px-2 py-1 rounded-full">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
