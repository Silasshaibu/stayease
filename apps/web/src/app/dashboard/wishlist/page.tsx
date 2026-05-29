'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usersApi } from '@/services/api';
import { HotelCard } from '@/components/hotels/HotelCard';
import { Hotel } from '@/types';

export default function WishlistPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => usersApi.getWishlist().then((r) => r.data),
  });

  const removeMutation = useMutation({
    mutationFn: (hotelId: string) => usersApi.removeFromWishlist(hotelId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
  });

  if (isLoading) return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {[1, 2, 3, 4].map((i) => <div key={i} className="h-72 animate-pulse rounded-xl bg-slate-100" />)}
    </div>
  );

  if (!data?.length) return (
    <div className="rounded-xl border border-slate-100 bg-white p-10 text-center shadow-sm">
      <p className="text-lg font-semibold text-slate-700">Your wishlist is empty</p>
      <p className="text-sm text-slate-400 mt-1">Save hotels you love and book them later.</p>
    </div>
  );

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">My Wishlist</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {data.map((item: { hotel: Hotel }) => (
          <HotelCard
            key={item.hotel.id}
            hotel={item.hotel}
            onWishlist={(id) => removeMutation.mutate(id)}
          />
        ))}
      </div>
    </div>
  );
}
