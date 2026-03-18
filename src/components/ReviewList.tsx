import type { Review } from '@/types';
import { StarRating } from './starRating';
import { motion } from 'framer-motion';

interface ReviewListProps {
  reviews: Review[];
}

function formatReviewDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">There are no reviews for this product yet.</p>
        <p className="text-gray-400 text-sm mt-2">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex gap-4 border-b border-gray-200 pb-6"
        >
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-xl">
            {review.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-800">{review.user.name}</h4>
              <span className="text-sm text-gray-500">
                {formatReviewDate(String(review.created_at))}
              </span>
            </div>
            <StarRating rating={review.rating} size={16} className="my-2" />
            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}