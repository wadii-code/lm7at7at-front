import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, X } from 'lucide-react';

const VISITED_KEY = 'has_visited_before';

const slides = [
  {
    image: '/images/pink.jpeg',
    title: '1 T-shirt',
    subtitle: 'Prix: 149dh - Qualité premium, confort exceptionnel',
    buttonText: 'Commander',
    url: '/products',
  },
  {
    image: '/images/black.jpeg',
    title: '2 T-shirts',
    subtitle: 'Prix: 269dh - Économisez 29dh !',
    buttonText: 'Commander',
    url: '/products',
  },
  {
    image: '/images/white.jpeg',
    title: '3 T-shirts',
    subtitle: 'Prix: 349dh - Livraison gratuite incluse !',
    buttonText: 'Commander',
    url: '/products',
  },
];

const slideVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

export function PromotionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem(VISITED_KEY);
    
    if (!hasVisited) {
      // Open the modal automatically after a short delay for first-time visitors
      const openTimer = setTimeout(() => {
        setIsOpen(true);
        // Mark as visited
        localStorage.setItem(VISITED_KEY, 'true');
      }, 1500);
      
      // Auto-play slides
      const slideTimer = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000);

      return () => {
        clearTimeout(openTimer);
        clearInterval(slideTimer);
      };
    }
    // If hasVisited is true, do nothing - modal stays closed
  }, []);


  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-4xl h-[80vh] max-h-[600px] bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-20 text-white hover:bg-white/20 rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Slider Content */}
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={index}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[index].image})` }}
            >
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 flex flex-col items-start justify-end h-full p-8 md:p-12 text-white">
            <motion.div
              key={index} 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="max-w-md"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-3">
                {slides[index].title}
              </h2>
              <p className="text-md md:text-lg text-gray-200 mb-6">
                {slides[index].subtitle}
              </p>
              <Link to={slides[index].url} onClick={() => setIsOpen(false)}>
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-200 font-bold text-lg px-8 py-6 rounded-full transition-transform transform hover:scale-105">
                  {slides[index].buttonText}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === index ? 'bg-white' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}