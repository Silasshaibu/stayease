import { create } from 'zustand';
import { Hotel, Room } from '@/types';

interface BookingState {
  hotel: Hotel | null;
  room: Room | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  setHotel: (hotel: Hotel) => void;
  setRoom: (room: Room) => void;
  setDates: (checkIn: string, checkOut: string) => void;
  setGuests: (guests: number) => void;
  clear: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  hotel: null,
  room: null,
  checkIn: '',
  checkOut: '',
  guests: 1,
  setHotel: (hotel) => set({ hotel }),
  setRoom: (room) => set({ room }),
  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuests: (guests) => set({ guests }),
  clear: () => set({ hotel: null, room: null, checkIn: '', checkOut: '', guests: 1 }),
}));
