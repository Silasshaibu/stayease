'use client';
import { useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { MapPinIcon, ClockIcon, CheckIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { hotelsApi, reviewsApi } from '@/services/api';
import { useBookingStore } from '@/store/booking.store';
import { useAuthStore } from '@/store/auth.store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { Room, Review } from '@/types';

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { setHotel, setRoom, setDates, checkIn, checkOut } = useBookingStore();

  const { data: hotel, isLoading } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelsApi.getOne(id).then((r) => r.data),
  });

  const { data: reviewData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewsApi.getByHotel(id).then((r) => r.data),
  });

  const handleBook = (room: Room) => {
    if (!user) { router.push('/login'); return; }
    if (!checkIn || !checkOut) { toast.error('Please select check-in and check-out dates'); return; }
    setHotel(hotel);
    setRoom(room);
    router.push('/checkout');
  };

  if (isLoading) return (
    <>
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 animate-pulse">
        <div className="h-72 rounded-2xl bg-slate-100 mb-6" />
        <div className="h-8 w-64 bg-slate-100 rounded mb-4" />
        <div className="h-4 w-48 bg-slate-100 rounded" />
      </div>
    </>
  );

  if (!hotel) return (
    <>
      <Navbar />
      <div className="text-center py-20 text-slate-500">Hotel not found</div>
      <Footer />
    </>
  );

  const avgRating = reviewData?.averageRating || 0;
  const primaryImage = hotel.images?.find((i: any) => i.isPrimary) || hotel.images?.[0];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Images */}
        <div className="grid grid-cols-2 gap-2 h-72 rounded-2xl overflow-hidden mb-8">
          <div className="relative col-span-2 sm:col-span-1 bg-slate-100">
            {primaryImage && <Image src={primaryImage.url} alt={hotel.name} fill className="object-cover" />}
          </div>
          <div className="hidden sm:grid grid-rows-2 gap-2">
            {hotel.images?.slice(1, 3).map((img: any) => (
              <div key={img.id} className="relative bg-slate-100">
                <Image src={img.url} alt={hotel.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{hotel.name}</h1>
                  <div className="mt-1 flex items-center gap-2 text-slate-500">
                    <MapPinIcon className="h-4 w-4" />
                    <span className="text-sm">{hotel.address}, {hotel.city}, {hotel.country}</span>
                  </div>
                </div>
                {avgRating > 0 && (
                  <div className="shrink-0 rounded-xl bg-primary-600 px-3 py-2 text-center">
                    <div className="text-xl font-bold text-white">{avgRating}</div>
                    <div className="text-xs text-primary-100">{reviewData?.totalReviews} reviews</div>
                  </div>
                )}
              </div>
              <div className="mt-2"><StarRating rating={hotel.starRating} size="md" /></div>
            </div>

            {hotel.description && (
              <div>
                <h2 className="mb-2 font-semibold text-slate-800">About</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{hotel.description}</p>
              </div>
            )}

            {hotel.amenities?.length > 0 && (
              <div>
                <h2 className="mb-3 font-semibold text-slate-800">Amenities</h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {hotel.amenities.map((a: string) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rooms */}
            <div>
              <h2 className="mb-4 font-semibold text-slate-800 text-lg">Available Rooms</h2>
              <div className="space-y-4">
                {hotel.rooms?.map((room: Room) => (
                  <div key={room.id} className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row items-start gap-4">
                    <div className="relative h-24 w-36 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                      {room.images?.[0] && <Image src={room.images[0].url} alt={room.name} fill className="object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{room.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{room.bedType} · {room.capacity} guests{room.size ? ` · ${room.size}m²` : ''}</p>
                      {room.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{room.description}</p>}
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xl font-bold text-primary-600">${Number(room.pricePerNight).toFixed(0)}</div>
                      <div className="text-xs text-slate-400">/ night</div>
                      <Button size="sm" className="mt-2" onClick={() => handleBook(room)}>Book Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            {reviewData?.reviews?.length > 0 && (
              <div>
                <h2 className="mb-4 font-semibold text-slate-800 text-lg">Guest Reviews</h2>
                <div className="space-y-4">
                  {reviewData.reviews.slice(0, 5).map((review: Review) => (
                    <div key={review.id} className="rounded-xl bg-slate-50 p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                          {review.user?.firstName?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{review.user?.firstName} {review.user?.lastName}</p>
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      {review.comment && <p className="text-sm text-slate-600">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4">Select Dates</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-500">Check-in</label>
                  <input type="date" value={checkIn} onChange={(e) => setDates(e.target.value, checkOut)}
                    className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
                    min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Check-out</label>
                  <input type="date" value={checkOut} onChange={(e) => setDates(checkIn, e.target.value)}
                    className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
                    min={checkIn || new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2"><ClockIcon className="h-4 w-4" /><span>Check-in: {hotel.checkInTime}</span></div>
                <div className="flex items-center gap-2"><ClockIcon className="h-4 w-4" /><span>Check-out: {hotel.checkOutTime}</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
