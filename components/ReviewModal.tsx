
import React, { useState, useEffect } from 'react';
import { XIcon } from './Icons';
import StarRating from './StarRating';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  doctorName: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  doctorName,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setRating(0);
      setComment('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(rating, comment);
    } else {
      alert("Please select a rating.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-neutral-800">Leave a Review</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100"
            aria-label="Close"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <p className="mb-4 text-neutral-600">
          How was your experience with <span className="font-semibold">{doctorName}</span>?
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Your Rating</label>
            <StarRating rating={rating} onRatingChange={setRating} iconSize="w-8 h-8"/>
          </div>
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-neutral-700">
              Your Comments (optional)
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Tell us more about your experience..."
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0}
              className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark disabled:bg-neutral-400"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
