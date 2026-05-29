'use client';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/services/api';

export default function AdminPaymentsPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats().then((r) => r.data),
  });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: () => adminApi.getBookings({ limit: 50 }).then((r) => r.data),
  });

  const paid = bookings?.bookings?.filter((b: any) => b.payment?.status === 'PAID') || [];
  const pending = bookings?.bookings?.filter((b: any) => !b.payment || b.payment?.status === 'PENDING') || [];

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">Payments & Revenue</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="text-2xl font-bold text-emerald-600">${Number(stats?.totalRevenue || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Paid Transactions</p>
          <p className="text-2xl font-bold text-slate-800">{paid.length}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending Payments</p>
          <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
        </div>
      </div>

      <h2 className="font-semibold text-slate-700 mb-3">Recent Paid Transactions</h2>
      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : paid.length ? (
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Hotel</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paid.slice(0, 20).map((b: any) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-700">{b.user?.firstName} {b.user?.lastName}</td>
                  <td className="px-4 py-3 text-slate-600">{b.hotel?.name}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">${Number(b.totalAmount).toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-500">{b.payment?.provider || '—'}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{new Date(b.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-slate-400 py-8">No paid transactions yet.</p>
      )}
    </div>
  );
}
