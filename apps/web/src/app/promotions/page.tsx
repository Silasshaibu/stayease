import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

const deals = [
  { title: 'Early Bird Discount', desc: 'Book 30+ days in advance and save up to 25%.', badge: '25% OFF', color: 'bg-green-500' },
  { title: 'Weekend Escape', desc: 'Special rates for Friday–Sunday stays at select hotels.', badge: 'Weekend', color: 'bg-blue-500' },
  { title: 'Extended Stay', desc: 'Stay 7+ nights and get the 8th night free.', badge: 'Free Night', color: 'bg-purple-500' },
  { title: 'Last Minute Deals', desc: 'Book within 48 hours for exclusive discounted rates.', badge: 'Last Min', color: 'bg-orange-500' },
];

export default function PromotionsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-800">Deals & Offers</h1>
          <p className="mt-2 text-slate-500">Exclusive promotions for your next stay</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {deals.map((deal) => (
            <div key={deal.title} className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-xs font-bold text-white ${deal.color}`}>
                {deal.badge}
              </span>
              <h2 className="text-lg font-bold text-slate-800 mb-2">{deal.title}</h2>
              <p className="text-sm text-slate-500 mb-4">{deal.desc}</p>
              <Link
                href="/search"
                className="inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                Browse Hotels
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Use a Coupon Code</h2>
          <p className="text-primary-200 mb-4">Have a promo code? Enter it at checkout to unlock special pricing.</p>
          <Link href="/search" className="inline-block rounded-xl bg-white px-6 py-3 font-semibold text-primary-700 hover:bg-primary-50 transition-colors">
            Find Hotels
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
