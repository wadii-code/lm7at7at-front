import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export function PricingPacks() {
  return (
    <section className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Pack 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-card border border-gray-200 w-full sm:w-48 text-center hover:shadow-card-hover transition-shadow"
          >
            <p className="text-gray-600 text-sm mb-2">Pack 1</p>
            <p className="text-3xl font-bold text-gray-900">250DH</p>
          </motion.div>

          {/* Pack 3 - Most Popular */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-gold-light/30 rounded-xl p-6 shadow-card border-2 border-secondary w-full sm:w-56 text-center hover:shadow-card-hover transition-shadow"
          >
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              الأكثر مبيعاً
            </div>
            
            <p className="text-gray-700 text-sm mb-2 font-medium">Pack 3</p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-3xl font-bold text-gray-900">500DH</p>
              <p className="text-lg text-gray-400 line-through">750DH</p>
            </div>
            <div className="flex items-center justify-center gap-1 text-orange-600 text-sm font-medium">
              <Flame className="w-4 h-4" />
              <span>دفع ثمن جوج وخذ الثالث فابور</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
