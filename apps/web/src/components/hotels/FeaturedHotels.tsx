'use client';
import { useQuery } from '@tanstack/react-query';
import { hotelsApi } from '@/services/api';
import { HotelCard } from './HotelCard';
import { Hotel } from '@/types';

export function FeaturedHotels() {
  const { data, isLoading } = useQuery({
    queryKey: ['hotels', 'featured'],
    queryFn: () => hotelsApi.getFeatured().then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return <p className="text-slate-400 text-center py-8">No featured hotels yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((hotel: Hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
    </div>
  );
}
