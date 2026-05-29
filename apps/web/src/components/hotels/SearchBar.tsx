'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, MapPinIcon, CalendarIcon, UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SearchBarProps {
  initialValues?: { destination?: string; checkIn?: string; checkOut?: string; guests?: number };
  compact?: boolean;
}

export function SearchBar({ initialValues, compact = false }: SearchBarProps) {
  const router = useRouter();
  const [destination, setDestination] = useState(initialValues?.destination || '');
  const [checkIn, setCheckIn] = useState(initialValues?.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialValues?.checkOut || '');
  const [guests, setGuests] = useState(initialValues?.guests || 1);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests > 1) params.set('guests', String(guests));
    router.push(`/search?${params.toString()}`);
  };

  if (compact) {
    return (
      <div className="flex flex-wrap items-end gap-2 rounded-xl bg-white p-3 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 flex-1 min-w-[140px]">
          <MapPinIcon className="h-4 w-4 text-slate-400 shrink-0" />
          <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" className="w-full text-sm outline-none" />
        </div>
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="text-sm outline-none border-l border-slate-200 pl-3" />
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="text-sm outline-none border-l border-slate-200 pl-3" />
        <Button size="sm" onClick={handleSearch}>Search</Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl border border-slate-100">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100">
          <MapPinIcon className="h-5 w-5 text-slate-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500">Destination</p>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where are you going?"
              className="w-full bg-transparent text-sm font-medium outline-none placeholder-slate-400"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100">
          <CalendarIcon className="h-5 w-5 text-slate-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500">Check-in</p>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-sm font-medium outline-none"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100">
          <CalendarIcon className="h-5 w-5 text-slate-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500">Check-out</p>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-sm font-medium outline-none"
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100">
          <UsersIcon className="h-5 w-5 text-slate-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500">Guests</p>
            <input
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-transparent text-sm font-medium outline-none"
            />
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button size="lg" onClick={handleSearch} className="gap-2">
          <SearchIcon className="h-4 w-4" />
          Search Hotels
        </Button>
      </div>
    </div>
  );
}
