'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Navbar } from '@/components/layout/Navbar';
import { clsx } from 'clsx';
import { CalendarDaysIcon, HeartIcon, StarIcon, UserIcon, BellIcon } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'My Bookings', icon: CalendarDaysIcon, exact: true },
  { href: '/dashboard/wishlist', label: 'Wishlist', icon: HeartIcon },
  { href: '/dashboard/reviews', label: 'My Reviews', icon: StarIcon },
  { href: '/dashboard/profile', label: 'Profile', icon: UserIcon },
  { href: '/dashboard/notifications', label: 'Notifications', icon: BellIcon },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  if (!user) {
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-56 shrink-0">
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="mb-4 pb-4 border-b border-slate-100">
                <p className="font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
              <nav className="space-y-1">
                {navItems.map(({ href, label, icon: Icon, exact }) => {
                  const active = exact ? pathname === href : pathname.startsWith(href);
                  return (
                    <Link key={href} href={href} className={clsx(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800',
                    )}>
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </>
  );
}
