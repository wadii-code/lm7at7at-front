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
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
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
    <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${'/images/omertamask.png'})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div
        className="relative z-10 h-full flex flex-col items-end justify-center text-left text-white p-8 md:p-16 lg:p-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight max-w-3xl"
        >
          Style Redefined
          <br />
          <span className="text-gold">Confidence Unleashed</span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-4 max-w-xl text-lg md:text-xl text-gray-300"
        >
          Explore a curated collection where timeless design meets contemporary fashion.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8">
          <Link to="/products">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-200 font-semibold rounded-md shadow-lg group"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}