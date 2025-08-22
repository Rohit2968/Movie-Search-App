import React from 'react';
import { Star } from 'lucide-react';

export function StarRating({ rating, onRatingChange, readonly = false, size = 'md' }) {
  const [hoveredRating, setHoveredRating] = React.useState(null);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const displayRating = hoveredRating !== null ? hoveredRating : rating;

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHoveredRating(star)}
          onMouseLeave={() => !readonly && setHoveredRating(null)}
          className={`transition-all duration-200 ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <Star
            className={`${sizeClasses[size]} transition-colors duration-200 ${
              star <= displayRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-600 hover:text-yellow-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}