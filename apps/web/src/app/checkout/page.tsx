'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { differenceInCalendarDays } from 'date-fns';
import toast from 'react-hot-toast';
import { bookingsApi, paymentsApi } from '@/services/api';
import { useBookingStore } from '@/store/booking.store';
import { useAuthStore } from '@/store/auth.store';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { hotel, room, checkIn, checkOut, guests, clear } = useBookingStore();
  const [couponCode, setCouponCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) { router.push('/login'); return null; }
  if (!hotel || !room || !checkIn || !checkOut) {
    router.push('/search'); return null;
  }

  const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  const subtotal = Number(room.pricePerNight) * nights;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const { data: booking } = await bookingsApi.create({
        hotelId: hotel.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guests,
        couponCode: couponCode || undefined,
        guestNotes: notes || undefined,
      });

      const { data: payment } = await paymentsApi.initialize(booking.id);
      clear();

      if (payment.url) {
        window.location.href = payment.url;
      } else {
        toast.success('Booking created!');
        router.push('/dashboard/bookings');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Complete Your Booking</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-5">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-800 mb-4">Booking Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Hotel</span><span className="font-medium text-slate-800">{hotel.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Room</span><span className="font-medium text-slate-800">{room.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Check-in</span><span className="font-medium">{new Date(checkIn).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Check-out</span><span className="font-medium">{new Date(checkOut).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Nights</span><span className="font-medium">{nights}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Guests</span><span className="font-medium">{guests}</span></div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-800 mb-4">Guest Information</h2>
              <div className="text-sm text-slate-700 space-y-1">
                <p>{user.firstName} {user.lastName}</p>
                <p className="text-slate-400">{user.email}</p>
              </div>
              <div className="mt-4">
                <label className="text-xs font-medium text-slate-500 mb-1 block">Special Requests (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-400 resize-none"
                  placeholder="Any special requests..."
                />
              </div>
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-500 mb-1 block">Coupon Code (optional)</label>
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
                  placeholder="Enter coupon code"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-800 mb-4">Price Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>${Number(room.pricePerNight).toFixed(0)} × {nights} nights</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Service fee (5%)</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between font-bold text-slate-800 text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="mt-5 w-full"
                size="lg"
                onClick={handleCheckout}
                isLoading={isLoading}
              >
                Pay with Stripe
              </Button>
              <p className="mt-3 text-center text-xs text-slate-400">Secured by Stripe. Cancel anytime before check-in.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
