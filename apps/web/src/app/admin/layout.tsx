'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Navbar } from '@/components/layout/Navbar';
import { clsx } from 'clsx';
import { LayoutDashboardIcon, UsersIcon, BuildingOfficeIcon, CalendarCheckIcon, CreditCardIcon, ShieldAlertIcon } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboardIcon, exact: true },
  { href: '/admin/users', label: 'Users', icon: UsersIcon },
  { href: '/admin/hotels', label: 'Hotels', icon: BuildingOfficeIcon },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheckIcon },
  { href: '/admin/payments', label: 'Payments', icon: CreditCardIcon },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  if (user && user.role !== 'ADMIN') {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="w-full md:w-56 shrink-0">
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 px-3">Admin Panel</p>
              <nav className="space-y-1">
                {navItems.map(({ href, label, icon: Icon, exact }) => {
                  const active = exact ? pathname === href : pathname.startsWith(href);
                  return (
                    <Link key={href} href={href} className={clsx(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50',
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
