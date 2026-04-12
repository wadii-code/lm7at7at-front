import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useCollectionStore } from '@/store/collectionStore';
import React from 'react';
import { Link } from 'react-router-dom';

const MotionLink = motion(Link);

export function CollectionsSection() {
  const { collections, getRealProductCount } = useCollectionStore();
  
  const [realCounts, setRealCounts] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    const fetchCounts = async () => {
      const counts: Record<string, number> = {};
      for (const collection of collections) {
        const category = collection.href.replace('/products/', '');
        counts[category] = await getRealProductCount(category);
      }
      setRealCounts(counts);
    };
    fetchCounts();
  }, [collections, getRealProductCount]);

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
          <h2 className="text-2xl md:text-3xl font-bold text-white-900">
            Collections
          </h2>
        </motion.div>

        {/* Collections Grid - Show all collections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => {
            // Get real product count for this collection
            const category = collection.href.replace('/products/', '');
            const realCount = realCounts[category] || 0;
            
            return (
              <MotionLink
                key={collection.id}
                to={collection.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100"
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/1.jpeg';
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-xl mb-1">
                    {collection.name}
                  </h3>
                  <p className="text-white/80 text-sm mb-2">
                    {realCount} {realCount === 1 ? 'product' : 'products'}
                  </p>
                  <div className="flex items-center gap-2 text-white/80 text-sm group-hover:text-white transition-colors">
                    <span>See collection</span>
                    <ArrowLeft className="w-4 h-4 transform rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </MotionLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}