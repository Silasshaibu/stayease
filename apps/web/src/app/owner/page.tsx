'use client';
import { useQuery } from '@tanstack/react-query';
import { hotelsApi, bookingsApi } from '@/services/api';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { BuildingOfficeIcon, CalendarCheckIcon, CurrencyDollarIcon } from 'lucide-react';

export default function OwnerOverviewPage() {
  const { user } = useAuthStore();
  const { data: hotels } = useQuery({
    queryKey: ['owner', 'hotels'],
    queryFn: () => hotelsApi.getMyHotels().then((r) => r.data),
  });

  const totalRooms = hotels?.reduce((s: number, h: any) => s + (h._count?.rooms || 0), 0) || 0;
  const totalBookings = hotels?.reduce((s: number, h: any) => s + (h._count?.bookings || 0), 0) || 0;

  const stats = [
    { label: 'Properties', value: hotels?.length || 0, icon: BuildingOfficeIcon, href: '/owner/properties', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Rooms', value: totalRooms, icon: CalendarCheckIcon, href: '/owner/rooms', color: 'bg-green-50 text-green-600' },
    { label: 'Total Bookings', value: totalBookings, icon: CalendarCheckIcon, href: '/owner/bookings', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-2">Welcome, {user?.firstName}</h1>
      <p className="text-sm text-slate-500 mb-6">Manage your properties and reservations.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`inline-flex rounded-lg p-2 mb-3 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent hotels */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Your Properties</h2>
          <Link href="/owner/properties" className="text-sm text-primary-600 hover:underline">View all</Link>
        </div>
        {hotels?.length ? (
          <div className="space-y-3">
            {hotels.slice(0, 3).map((hotel: any) => (
              <div key={hotel.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div>
                  <p className="font-medium text-slate-800">{hotel.name}</p>
                  <p className="text-xs text-slate-400">{hotel.city}, {hotel.country}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  hotel.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  hotel.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'
                }`}>
                  {hotel.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
            <p className="text-slate-500 mb-3">You haven't listed any properties yet.</p>
            <Link href="/owner/properties" className="inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
              Add Your First Hotel
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
