import type { Review } from '@/types';
import { StarRating } from './StarRating';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useReviewStore } from '@/store/reviewStore';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

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
  const { user, token } = useAuthStore();
  const { deleteReview } = useReviewStore();

  const handleDelete = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await deleteReview(reviewId, token || '');
    }
  };
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
                {formatReviewDate(String(review.createdAt))}
              </span>
            </div>
            <StarRating rating={review.rating} size={16} className="my-2" />
            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
            {user?.isAdmin && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="mt-2 text-red-500 hover:text-red-700"
                onClick={() => handleDelete(review.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}