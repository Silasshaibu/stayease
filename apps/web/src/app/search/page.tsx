'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/services/api';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchBar } from '@/components/hotels/SearchBar';
import { HotelCard } from '@/components/hotels/HotelCard';
import { Hotel } from '@/types';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function SearchPage() {
  const params = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  const [starFilter, setStarFilter] = useState<number | undefined>();

  const query = {
    destination: params.get('destination') || undefined,
    checkIn: params.get('checkIn') || undefined,
    checkOut: params.get('checkOut') || undefined,
    guests: params.get('guests') ? Number(params.get('guests')) : undefined,
    sortBy,
    starRating: starFilter,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchApi.search(query).then((r) => r.data),
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6">
          <SearchBar initialValues={query} compact />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-xl font-bold text-slate-800">
            {query.destination ? `Hotels in ${query.destination}` : 'All Hotels'}
            {data?.total !== undefined && <span className="ml-2 text-sm font-normal text-slate-500">({data.total} results)</span>}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setStarFilter(starFilter === s ? undefined : s)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${starFilter === s ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-200 text-slate-600 hover:border-primary-300'}`}
                >
                  {s}★+
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-primary-400"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-xl bg-slate-100" />)}
          </div>
        ) : data?.hotels?.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.hotels.map((hotel: Hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl font-semibold text-slate-700">No hotels found</p>
            <p className="mt-2 text-slate-400">Try a different destination or adjust your dates.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
