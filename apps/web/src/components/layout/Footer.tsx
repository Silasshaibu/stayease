import Link from 'next/link';
import { Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-bold text-primary-700">StayEase</span>
            </div>
            <p className="text-sm text-slate-500">Find your perfect stay worldwide. Best prices guaranteed.</p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-slate-800 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/search" className="hover:text-primary-600">Find Hotels</Link></li>
              <li><Link href="/promotions" className="hover:text-primary-600">Deals & Offers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-slate-800 text-sm">For Owners</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/owner" className="hover:text-primary-600">List Your Property</Link></li>
              <li><Link href="/owner" className="hover:text-primary-600">Owner Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-slate-800 text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><span className="hover:text-primary-600 cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-primary-600 cursor-pointer">Contact Us</span></li>
            </ul>
          </div>
        </div>
        <hr className="my-6 border-slate-200" />
        <p className="text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} StayEase. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
