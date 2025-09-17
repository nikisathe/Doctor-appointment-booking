
import React, { useState } from 'react';
import { StarIcon } from './Icons';

interface StarRatingProps {
  count?: number;
  rating: number;
  onRatingChange?: (rating: number) => void;
  className?: string;
  iconSize?: string;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  count = 5,
  rating,
  onRatingChange,
  className,
  iconSize = 'w-6 h-6',
  readOnly = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseMove = (index: number) => {
    if (readOnly || !onRatingChange) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (readOnly || !onRatingChange) return;
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (readOnly || !onRatingChange) return;
    onRatingChange(index + 1);
  };

  return (
    <div className={`flex items-center ${readOnly ? '' : 'cursor-pointer'} ${className}`}>
      {[...Array(count)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);

        return (
          <div
            key={index}
            onMouseMove={() => handleMouseMove(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            className="transform transition-transform duration-150 ease-in-out hover:scale-110"
          >
            <StarIcon
              className={`${iconSize} ${
                isFilled ? 'text-secondary' : 'text-neutral-300'
              }`}
              solid={isFilled}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
