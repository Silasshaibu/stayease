'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hotelsApi, bookingsApi } from '@/services/api';
import { clsx } from 'clsx';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CHECKED_IN: 'bg-blue-100 text-blue-700',
  CHECKED_OUT: 'bg-slate-100 text-slate-600',
  CANCELLED: 'bg-red-100 text-red-600',
};

export default function OwnerBookingsPage() {
  const [selectedHotelId, setSelectedHotelId] = useState('');

  const { data: hotels } = useQuery({
    queryKey: ['owner', 'hotels'],
    queryFn: () => hotelsApi.getMyHotels().then((r) => r.data),
  });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['owner', 'bookings', selectedHotelId],
    queryFn: () => bookingsApi.getHotelBookings(selectedHotelId).then((r) => r.data),
    enabled: !!selectedHotelId,
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">Reservations</h1>

      <div className="mb-5">
        <label className="text-sm font-medium text-slate-700 block mb-1">Select Property</label>
        <select value={selectedHotelId} onChange={(e) => setSelectedHotelId(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-72">
          <option value="">— choose a hotel —</option>
          {hotels?.map((h: any) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>

      {selectedHotelId && (
        isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}</div>
        ) : bookings?.length ? (
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{b.user?.firstName} {b.user?.lastName}</p>
                      <p className="text-xs text-slate-400">{b.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{b.room?.name}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                      <span className="block text-xs text-slate-400">{b.nights} nights</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">${Number(b.totalAmount).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={clsx('rounded-full px-2 py-0.5 text-xs font-medium', STATUS_COLORS[b.status] || 'bg-slate-100 text-slate-600')}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx('rounded-full px-2 py-0.5 text-xs font-medium',
                        b.payment?.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                        {b.payment?.status || 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-slate-400 py-8">No reservations for this property.</p>
        )
      )}
    </div>
  );
}
