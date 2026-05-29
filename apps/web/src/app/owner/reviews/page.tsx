'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hotelsApi, reviewsApi } from '@/services/api';
import { StarRating } from '@/components/ui/StarRating';

export default function OwnerReviewsPage() {
  const [selectedHotelId, setSelectedHotelId] = useState('');

  const { data: hotels } = useQuery({
    queryKey: ['owner', 'hotels'],
    queryFn: () => hotelsApi.getMyHotels().then((r) => r.data),
  });

  const { data: reviewData, isLoading } = useQuery({
    queryKey: ['reviews', selectedHotelId],
    queryFn: () => reviewsApi.getByHotel(selectedHotelId).then((r) => r.data),
    enabled: !!selectedHotelId,
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">Guest Reviews</h1>

      <div className="mb-5">
        <label className="text-sm font-medium text-slate-700 block mb-1">Select Property</label>
        <select value={selectedHotelId} onChange={(e) => setSelectedHotelId(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-72">
          <option value="">— choose a hotel —</option>
          {hotels?.map((h: any) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>

      {selectedHotelId && !isLoading && reviewData && (
        <>
          <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm mb-5">
            <div className="text-center px-4">
              <p className="text-4xl font-extrabold text-primary-600">{reviewData.averageRating}</p>
              <StarRating rating={reviewData.averageRating} size="md" />
              <p className="text-xs text-slate-400 mt-1">{reviewData.totalReviews} reviews</p>
            </div>
          </div>

          {reviewData.reviews?.length ? (
            <div className="space-y-4">
              {reviewData.reviews.map((r: any) => (
                <div key={r.id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-semibold">
                        {r.user?.firstName?.[0]}
                      </div>
                      <p className="font-medium text-slate-800 text-sm">{r.user?.firstName} {r.user?.lastName}</p>
                    </div>
                    <StarRating rating={r.rating} />
                  </div>
                  {r.comment && <p className="text-sm text-slate-600">{r.comment}</p>}
                  <p className="text-xs text-slate-400 mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400 py-8">No reviews for this property yet.</p>
          )}
        </>
      )}
    </div>
  );
}
