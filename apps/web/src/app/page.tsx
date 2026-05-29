import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchBar } from '@/components/hotels/SearchBar';
import { FeaturedHotels } from '@/components/hotels/FeaturedHotels';

const destinations = [
  { city: 'Dubai', country: 'UAE', emoji: '🏙️' },
  { city: 'Paris', country: 'France', emoji: '🗼' },
  { city: 'New York', country: 'USA', emoji: '🗽' },
  { city: 'Lagos', country: 'Nigeria', emoji: '🌍' },
  { city: 'London', country: 'UK', emoji: '🎡' },
  { city: 'Tokyo', country: 'Japan', emoji: '🗾' },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary-700 to-primary-900 py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-extrabold text-white md:text-5xl">
              Find Your Perfect Stay
            </h1>
            <p className="mt-4 text-lg text-primary-200">
              Thousands of hotels worldwide. Best prices. Easy booking.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">Popular Destinations</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {destinations.map((d) => (
              <a
                key={d.city}
                href={`/search?destination=${encodeURIComponent(d.city)}`}
                className="group flex flex-col items-center rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:border-primary-300 hover:shadow-md transition-all"
              >
                <span className="text-3xl">{d.emoji}</span>
                <span className="mt-2 font-semibold text-slate-700 group-hover:text-primary-600 text-sm">{d.city}</span>
                <span className="text-xs text-slate-400">{d.country}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Featured Hotels */}
        <section className="mx-auto max-w-7xl px-4 pb-14">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">Featured Hotels</h2>
          <FeaturedHotels />
        </section>

        {/* Why StayEase */}
        <section className="bg-primary-50 py-14 px-4">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-800">Why Choose StayEase?</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { icon: '🔒', title: 'Secure Booking', desc: 'All payments encrypted with Stripe. Your data is safe.' },
                { icon: '💰', title: 'Best Price Guarantee', desc: 'Find a lower price? We\'ll match it.' },
                { icon: '🌍', title: 'Global Coverage', desc: 'Hotels in 50+ countries and thousands of cities.' },
              ].map((f) => (
                <div key={f.title} className="rounded-xl bg-white p-6 shadow-sm text-center">
                  <div className="text-4xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-slate-800 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
