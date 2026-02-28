import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0 flex">
        <div
          className="w-1/2 h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/images/1.jpeg')" }}
        />
        <div
          className="w-1/2 h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/images/2.jpeg')" }}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-black/60" />

      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight"
          >
            Style Redefined. Quality Perfected.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300"
          >
            Discover our exclusive collection of high-quality T-shirts, crafted for comfort and designed to make a statement.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-10">
            <Link to="/products">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-200 font-bold text-lg px-8 py-6 rounded-full transition-transform transform hover:scale-105 shadow-lg"
              >
                Explore the Collection
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}