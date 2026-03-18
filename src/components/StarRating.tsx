import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
  onRatingChange?: (rating: number) => void;
  isInteractive?: boolean;
}

export function StarRating({
  rating,
  size = 20,
  className = '',
  onRatingChange,
  isInteractive = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (rate: number) => {
    if (isInteractive && onRatingChange) {
      onRatingChange(rate);
    }
  };

  const handleMouseEnter = (rate: number) => {
    if (isInteractive) {
      setHoverRating(rate);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex items-center ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`
            ${displayRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            ${isInteractive ? 'cursor-pointer transition-transform duration-200 hover:scale-125' : ''}
          `}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
}