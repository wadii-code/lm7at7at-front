import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    image: '/images/1.jpeg',
    title: 'Discover Your Signature Style',
    subtitle: 'Explore our new collection of premium T-shirts.',
    buttonText: 'Shop Now',
    url: '/products',
  },
  {
    image: '/images/2.jpeg',
    title: 'Unmatched Quality & Comfort',
    subtitle: 'Crafted for the perfect fit, designed to last.',
    buttonText: 'Explore Designs',
    url: '/products',
  },
];

const slideVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

export function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); 

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
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

      <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <motion.div
          key={index} // Re-trigger animation on slide change
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            {slides[index].title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            {slides[index].subtitle}
          </p>
          <Link to={slides[index].url}>
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-200 font-bold text-lg px-8 py-6 rounded-full transition-transform transform hover:scale-105">
              {slides[index].buttonText}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === index ? 'bg-white' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  );
}