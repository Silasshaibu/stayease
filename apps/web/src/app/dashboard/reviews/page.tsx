'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { reviewsApi } from '@/services/api';
import { StarRating } from '@/components/ui/StarRating';
import { Review } from '@/types';

export default function MyReviewsPage() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', 'me'],
    queryFn: () => reviewsApi.getMyReviews().then((r) => r.data),
  });

  if (isLoading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />)}
    </div>
  );

  if (!reviews?.length) return (
    <div className="rounded-xl border border-slate-100 bg-white p-10 text-center shadow-sm">
      <p className="text-lg font-semibold text-slate-700">No reviews yet</p>
      <p className="text-sm text-slate-400 mt-1">After your stay, leave a review to help other travellers.</p>
    </div>
  );

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">My Reviews</h1>
      <div className="space-y-4">
        {reviews.map((review: Review & { hotel?: any }) => (
          <div key={review.id} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/hotels/${review.hotel?.id}`} className="font-semibold text-slate-800 hover:text-primary-600">
                  {review.hotel?.name}
                </Link>
                <p className="text-xs text-slate-400 mt-0.5">{review.hotel?.city}</p>
              </div>
              <StarRating rating={review.rating} />
            </div>
            {review.comment && <p className="mt-2 text-sm text-slate-600">{review.comment}</p>}
            <p className="mt-2 text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
