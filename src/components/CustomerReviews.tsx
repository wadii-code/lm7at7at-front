import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const reviews = [
  { id: 1, image: '/images/10.png', rating: 5 },
  { id: 2, image: '/images/11.png', rating: 5 },
  { id: 3, image: '/images/12.png', rating: 5 },
  { id: 4, image: '/images/13.png', rating: 5 },
  { id: 5, image: '/images/14.png', rating: 5 },
  { id: 6, image: '/images/15.png', rating: 5 },
];

export function CustomerReviews() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Triple the reviews for seamless infinite scroll
  const infiniteReviews = [...reviews, ...reviews, ...reviews];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrame: number;
    let scrollPosition = 0;
    
    // Calculate width of one set of reviews
    const singleSetWidth = scrollContainer.scrollWidth / 3;

    const scroll = () => {
      if (!scrollContainer || isHovered) {
        animationFrame = requestAnimationFrame(scroll);
        return;
      }

      scrollPosition += 0.5; // Scroll speed
      
      // Reset when we've scrolled one full set
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered]);

  return (
    <section className="py-12 md:py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 px-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Customer Reviews
          </h2>
        </motion.div>

        {/* Scrolling Container */}
        <div
          ref={scrollRef}
          className="overflow-x-hidden cursor-move"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex gap-4 px-4">
            {infiniteReviews.map((review, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[250px] sm:w-[280px] md:w-[300px]"
                onClick={() => setSelectedImage(review.image)}
              >
                <div className="relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow cursor-pointer group">
                  <img
                    src={review.image}
                    alt={`Review ${review.id}`}
                    className="w-full h-[250px] sm:h-[280px] md:h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Rating Badge */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative"
            >
              <img
                src={selectedImage}
                alt="Enlarged review"
                className="max-w-[90vw] max-h-[90vh] rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/75"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}