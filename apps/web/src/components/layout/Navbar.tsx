'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { BellIcon, UserCircleIcon, BuildingOfficeIcon } from 'lucide-react';

export function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <BuildingOfficeIcon className="h-7 w-7 text-primary-600" />
          <span className="text-xl font-bold text-primary-700">StayEase</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/search" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
            Find Hotels
          </Link>
          <Link href="/promotions" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
            Deals
          </Link>
          {user?.role === 'HOTEL_OWNER' && (
            <Link href="/owner" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
              My Properties
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard/notifications" className="relative">
                <BellIcon className="h-5 w-5 text-slate-600 hover:text-primary-600" />
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm hover:border-primary-300 transition-colors">
                  <UserCircleIcon className="h-5 w-5 text-slate-500" />
                  <span className="hidden md:block font-medium text-slate-700">{user.firstName}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-xl border border-slate-100 bg-white py-2 shadow-lg group-hover:block">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">My Bookings</Link>
                  <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Profile</Link>
                  <Link href="/dashboard/wishlist" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Wishlist</Link>
                  <hr className="my-1" />
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link href="/register"><Button size="sm">Sign Up</Button></Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
