'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { bookingsApi } from '@/services/api';
import { Booking } from '@/types';
import { clsx } from 'clsx';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CHECKED_IN: 'bg-blue-100 text-blue-700',
  CHECKED_OUT: 'bg-slate-100 text-slate-600',
  CANCELLED: 'bg-red-100 text-red-600',
  NO_SHOW: 'bg-gray-100 text-gray-500',
};

export default function DashboardBookingsPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', 'me'],
    queryFn: () => bookingsApi.getMyBookings().then((r) => r.data),
  });

  if (isLoading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-100" />)}
    </div>
  );

  if (!bookings?.length) return (
    <div className="rounded-xl border border-slate-100 bg-white p-10 text-center shadow-sm">
      <p className="text-lg font-semibold text-slate-700">No bookings yet</p>
      <p className="text-sm text-slate-400 mt-1">Browse hotels and make your first booking.</p>
      <Link href="/search" className="mt-4 inline-block rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700">
        Find Hotels
      </Link>
    </div>
  );

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">My Bookings</h1>
      <div className="space-y-4">
        {bookings.map((booking: Booking) => (
          <div key={booking.id} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-800">{booking.hotel?.name}</h3>
                  <span className={clsx('rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_COLORS[booking.status])}>
                    {booking.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{booking.room?.name} · {booking.hotel?.city}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>Check-in: <strong className="text-slate-700">{new Date(booking.checkIn).toLocaleDateString()}</strong></span>
                  <span>Check-out: <strong className="text-slate-700">{new Date(booking.checkOut).toLocaleDateString()}</strong></span>
                  <span>{booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-primary-600">${Number(booking.totalAmount).toFixed(2)}</p>
                <p className={clsx('text-xs mt-0.5', booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600')}>
                  {booking.paymentStatus}
                </p>
                {booking.status === 'PENDING' && (
                  <Link href={`/checkout?booking=${booking.id}`} className="mt-2 inline-block text-xs text-primary-600 hover:underline">
                    Complete Payment
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
