import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useReviewStore } from '@/store/reviewStore';
import { StarRating } from './StarRating';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const { isAuthenticated, user, token } = useAuthStore();
  const { addReview } = useReviewStore();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating.');
      return;
    }
    if (comment.trim() === '') {
      toast.error('Please write a comment.');
      return;
    }
    if (!user) {
      toast.error('Authentication error. Please log in again.');
      return;
    }

    setIsLoading(true);
    const success = await addReview(productId, rating, comment, token || '');
    setIsLoading(false);

    if (success) {
      toast.success('Thank you! Your review has been submitted.');
      setRating(0);
      setComment('');
    } else {
      toast.error('Failed to submit review. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700 font-medium">Want to share your thoughts on this product?</p>
        <p className="text-gray-500 mt-2">
          <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link> or{' '}
          <Link to="/signup" className="text-primary font-bold hover:underline">sign up</Link> to leave a review.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            isInteractive={true}
            size={24}
          />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you like or dislike? How did you use this product?"
            rows={4}
            required
          />
        </div>
        <div className="text-right">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </div>
  );
}