
import { Review } from '../types';

const REVIEWS_KEY = 'docbook_reviews';

const reviewService = {
    async getReviews(doctorId: string): Promise<Review[]> {
        const storedReviews = localStorage.getItem(REVIEWS_KEY) || '[]';
        try {
            const reviews: Review[] = JSON.parse(storedReviews);
            // Filter by doctor and sort by most recent first
            return reviews
                .filter(review => review.doctorId === doctorId)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } catch (e) {
            console.error("Failed to parse reviews from localStorage", e);
            return [];
        }
    },

    async addReview(reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> {
        const storedReviews = localStorage.getItem(REVIEWS_KEY) || '[]';
        let reviews: Review[] = [];
        try {
            reviews = JSON.parse(storedReviews);
        } catch (e) {
             console.error("Failed to parse reviews from localStorage on add", e);
             reviews = [];
        }


        const newReview: Review = {
            ...reviewData,
            id: Date.now().toString(),
            date: new Date().toISOString(),
        };

        reviews.push(newReview);
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
        return newReview;
    },
};

export { reviewService };