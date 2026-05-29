'use client';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/services/api';
import { clsx } from 'clsx';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CHECKED_IN: 'bg-blue-100 text-blue-700',
  CHECKED_OUT: 'bg-slate-100 text-slate-600',
  CANCELLED: 'bg-red-100 text-red-600',
};

export default function AdminBookingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: () => adminApi.getBookings().then((r) => r.data),
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">All Bookings ({data?.total || 0})</h1>
      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Hotel</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.bookings?.map((b: any) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{b.user?.firstName} {b.user?.lastName}</p>
                    <p className="text-xs text-slate-400">{b.user?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700">{b.hotel?.name}</p>
                    <p className="text-xs text-slate-400">{b.hotel?.city}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-xs">
                    {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
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
      )}
    </div>
  );
}
