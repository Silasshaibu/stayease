'use client';
import { useQuery } from '@tanstack/react-query';
import { hotelsApi } from '@/services/api';

export default function OwnerPayoutsPage() {
  const { data: hotels } = useQuery({
    queryKey: ['owner', 'hotels'],
    queryFn: () => hotelsApi.getMyHotels().then((r) => r.data),
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">Payouts & Earnings</h1>

      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm mb-6">
        <p className="text-sm text-slate-500 mb-1">How payouts work</p>
        <p className="text-sm text-slate-700">
          The platform takes a <strong>15% commission</strong> on each confirmed booking.
          Payouts are processed automatically within 3–5 business days after guest check-out.
        </p>
      </div>

      {hotels?.length ? (
        <div className="space-y-4">
          {hotels.map((hotel: any) => (
            <div key={hotel.id} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-800">{hotel.name}</p>
                  <p className="text-xs text-slate-400">{hotel.city}, {hotel.country}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  hotel.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{hotel.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Bookings</p>
                  <p className="text-lg font-bold text-slate-800">{hotel._count?.bookings || 0}</p>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="text-xs text-slate-500">Commission Rate</p>
                  <p className="text-lg font-bold text-green-700">{Number(hotel.commission).toFixed(0)}%</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-xs text-slate-500">Rooms</p>
                  <p className="text-lg font-bold text-blue-700">{hotel._count?.rooms || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-400 py-8">No properties found.</p>
      )}
    </div>
  );
}
