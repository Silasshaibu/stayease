export type Role = 'GUEST' | 'HOTEL_OWNER' | 'ADMIN';
export type HotelStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: Role;
  isVerified: boolean;
  createdAt: string;
  wallet?: { balance: number; currency: string };
}

export interface HotelImage {
  id: string;
  url: string;
  isPrimary: boolean;
  caption?: string;
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  starRating: number;
  status: HotelStatus;
  isFeatured: boolean;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  images: HotelImage[];
  reviews: { rating: number }[];
  avgRating?: number;
  reviewCount?: number;
  startingFrom?: number;
  _count?: { rooms: number; bookings: number };
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  description?: string;
  pricePerNight: number;
  capacity: number;
  bedType: string;
  size?: number;
  amenities: string[];
  images: { url: string }[];
}

export interface Booking {
  id: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  pricePerNight: number;
  subtotal: number;
  discount: number;
  serviceFee: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  hotel?: { name: string; city: string; images?: HotelImage[] };
  room?: { name: string };
  payment?: { status: PaymentStatus; provider: string };
  createdAt: string;
}

export interface Review {
  id: string;
  hotelId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { id: string; firstName: string; lastName: string; avatar?: string };
}

export interface SearchParams {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number;
  sortBy?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
