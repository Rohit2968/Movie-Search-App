import React from 'react';
import { Star } from 'lucide-react';

export function StarRating({ rating, onRatingChange, readonly = false, size = 'md' }) {
  const [hoveredRating, setHoveredRating] = React.useState(null);

  // Responsive sizes (mobile → desktop)
  const sizeClasses = {
    sm: 'w-4 h-4 sm:w-5 sm:h-5',
    md: 'w-5 h-5 sm:w-6 sm:h-6',
    lg: 'w-6 h-6 sm:w-7 sm:h-7'
  };

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const displayRating = hoveredRating !== null ? hoveredRating : rating;

  return (
    <div className="flex gap-1 sm:gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => handleClick(star)}
          // Desktop hover only — mobile ignores hover events
          onMouseEnter={() => !readonly && setHoveredRating(star)}
          onMouseLeave={() => !readonly && setHoveredRating(null)}
          className={`
            transition-transform duration-200 
            touch-manipulation
            ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'}
          `}
        >
          <Star
            className={`
              ${sizeClasses[size]}
              transition-colors duration-200 drop-shadow-sm
              ${star <= displayRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-600 sm:text-gray-500 hover:text-yellow-300'
              }
            `}
          />
        </button>
      ))}
    </div>
  );
}
