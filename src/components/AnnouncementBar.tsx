import { motion } from 'framer-motion';

export function AnnouncementBar() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full bg-announcement text-white py-2.5 px-4 text-center"
    >
      <p className="text-sm font-medium tracking-wide">
        عرض فلاش 24 ساعة: 1+1 = الهدية الثالثة 🎁 = 499 درهم
      </p>
    </motion.div>
  );
}
