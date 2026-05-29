'use client';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/services/api';
import { UsersIcon, Building2, CalendarCheckIcon, DollarSign, ClockIcon } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats().then((r) => r.data),
  });

  const cards = [
    { label: 'Total Users', value: stats?.users, icon: UsersIcon, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Hotels', value: stats?.hotels, icon: Building2, color: 'bg-green-50 text-green-600' },
    { label: 'Pending Approval', value: stats?.pendingHotels, icon: ClockIcon, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Total Bookings', value: stats?.bookings, icon: CalendarCheckIcon, color: 'bg-purple-50 text-purple-600' },
    { label: 'Active Bookings', value: stats?.activeBookings, icon: CalendarCheckIcon, color: 'bg-teal-50 text-teal-600' },
    { label: 'Total Revenue', value: stats?.totalRevenue ? `$${Number(stats.totalRevenue).toLocaleString()}` : '$0', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
  ];

  if (isLoading) return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />)}
    </div>
  );

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className={`inline-flex rounded-lg p-2 mb-3 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value ?? '—'}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
