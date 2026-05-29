'use client';
import Link from 'next/link';
import Image from 'next/image';
import { MapPinIcon, HeartIcon } from 'lucide-react';
import { Hotel } from '@/types';
import { StarRating } from '@/components/ui/StarRating';

interface HotelCardProps {
  hotel: Hotel;
  onWishlist?: (hotelId: string) => void;
}

export function HotelCard({ hotel, onWishlist }: HotelCardProps) {
  const primaryImage = hotel.images?.find((i) => i.isPrimary) || hotel.images?.[0];
  const avgRating = hotel.avgRating ??
    (hotel.reviews?.length ? Number((hotel.reviews.reduce((s, r) => s + r.rating, 0) / hotel.reviews.length).toFixed(1)) : null);

  return (
    <Link href={`/hotels/${hotel.id}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 transition-shadow hover:shadow-md">
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={hotel.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">
              <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0H5m14 0v-5a1 1 0 00-1-1H6a1 1 0 00-1 1v5" />
              </svg>
            </div>
          )}
          {hotel.isFeatured && (
            <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-2 py-0.5 text-xs font-semibold text-white">Featured</span>
          )}
          {onWishlist && (
            <button
              onClick={(e) => { e.preventDefault(); onWishlist(hotel.id); }}
              className="absolute right-3 top-3 rounded-full bg-white p-1.5 shadow hover:bg-red-50"
            >
              <HeartIcon className="h-4 w-4 text-slate-400 hover:text-red-500" />
            </button>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-800 leading-tight line-clamp-2">{hotel.name}</h3>
            {avgRating && (
              <div className="shrink-0 flex items-center gap-1 rounded-lg bg-primary-600 px-2 py-1">
                <span className="text-xs font-bold text-white">{avgRating}</span>
              </div>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1 text-slate-500">
            <MapPinIcon className="h-3.5 w-3.5" />
            <span className="text-xs">{hotel.city}, {hotel.country}</span>
          </div>
          <div className="mt-2">
            <StarRating rating={hotel.starRating} />
          </div>
          {hotel.startingFrom && (
            <div className="mt-3 flex items-end justify-between">
              <div>
                <span className="text-xs text-slate-400">from</span>
                <div className="text-lg font-bold text-primary-600">${Number(hotel.startingFrom).toFixed(0)}</div>
                <span className="text-xs text-slate-400">per night</span>
              </div>
              {hotel.reviewCount ? (
                <span className="text-xs text-slate-400">{hotel.reviewCount} reviews</span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
