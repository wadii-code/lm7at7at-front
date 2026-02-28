import { motion } from 'framer-motion';
import { CheckCircle, Shirt } from 'lucide-react';
import { Link } from 'react-router-dom';

const basePrice = 149;

const packs = [
  {
    name: 'باك 1',
    price: '149',
    originalPrice: String(basePrice * 1),
    features: ['توصيل مجاني'],
    shirtCount: 1,
    badge: 'عرض أساسي',
    badgeColor: 'bg-orange-500 text-white',
    borderColor: 'border-gray-200',
    buttonClass: 'bg-gray-800 text-white',
  },
  {
    name: 'باك 2',
    price: '269',
    originalPrice: String(basePrice * 2),
    features: ['توصيل 0 درهم'],
    shirtCount: 2,
    badge: 'الأكثر مبيعاً',
    badgeColor: 'bg-red-500 text-white',
    borderColor: 'border-red-500',
    buttonClass: 'bg-red-500 text-white shadow-lg shadow-red-500/50',
  },
  {
    name: 'باك 3',
    price: '349',
    originalPrice: String(basePrice * 3),
    features: ['توصيل 0 درهم'],
    shirtCount: 3,
    badge: 'أعلى قيمة',
    badgeColor: 'bg-yellow-400 text-gray-900',
    borderColor: 'border-yellow-400',
    buttonClass: 'bg-gray-800 text-white',
  },
];

export function NewOffersSection() {
  return (
    <section className="bg-gray-50 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            عروض الباقات الجديدة
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
            وفر أكثر مع كل باقة. اختر باقتك الآن واستمتع بالخصم والتوصيل المجاني!
          </p>
        </motion.div>

        <div className="mt-20 grid gap-y-16 md:grid-cols-3 md:gap-x-8">
          {packs.map((pack, index) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg p-8 border-4 ${pack.borderColor}`}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={`text-sm font-bold px-6 py-2 rounded-full shadow-md ${pack.badgeColor}`}>
                  {pack.badge}
                </div>
              </div>

              <div className="flex justify-center items-center h-24 mt-8 mb-4">
                <div className="flex items-center justify-center">
                  {pack.shirtCount === 1 && <Shirt className="w-16 h-16 text-gray-800" strokeWidth={1.5} />}
                  {pack.shirtCount === 2 && (
                    <div className="flex items-center">
                      <Shirt className="w-14 h-14 text-gray-800 -mr-6" strokeWidth={1.5} />
                      <Shirt className="w-14 h-14 text-gray-800" strokeWidth={1.5} />
                    </div>
                  )}
                  {pack.shirtCount === 3 && (
                    <div className="flex items-center">
                      <Shirt className="w-12 h-12 text-gray-800 -mr-5 z-0" strokeWidth={1.5} />
                      <Shirt className="w-16 h-16 text-gray-800 z-10" strokeWidth={1.5} />
                      <Shirt className="w-12 h-12 text-gray-800 -ml-5 z-0" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-center text-gray-900">{pack.name}</h3>
              
              <div className="mt-4 text-center flex justify-center items-baseline gap-x-3">
                <span className="text-5xl font-extrabold text-gray-900">{pack.price}</span>
                <span className="text-lg font-medium text-gray-500">درهم</span>
                {pack.originalPrice && pack.price !== pack.originalPrice && (
                  <span className="text-2xl font-medium text-gray-400 line-through">
                    {pack.originalPrice}درهم
                  </span>
                )}
              </div>

              <ul className="mt-6 space-y-4 text-right">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-center justify-end">
                    <span>{feature}</span>
                    <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
                  </li>
                ))}
              </ul>

              <Link to="/products" className="block mt-8">
                <button
                  className={`w-full text-lg font-semibold py-3 rounded-lg transition-transform transform hover:scale-105 ${pack.buttonClass}`}
                >
                  اكتشف الباقات
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}