import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SearchQuery {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number;
  amenities?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'featured';
}

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: SearchQuery) {
    const { destination, checkIn, checkOut, guests, minPrice, maxPrice, starRating, amenities, page = 1, limit = 20, sortBy } = query;
    const skip = (page - 1) * limit;

    const where: any = { status: 'APPROVED' };

    if (destination) {
      where.OR = [
        { city: { contains: destination, mode: 'insensitive' } },
        { country: { contains: destination, mode: 'insensitive' } },
        { name: { contains: destination, mode: 'insensitive' } },
      ];
    }

    if (starRating) where.starRating = { gte: Number(starRating) };
    if (amenities) {
      const list = amenities.split(',');
      where.amenities = { hasEvery: list };
    }

    if (minPrice || maxPrice) {
      where.rooms = {
        some: {
          status: 'AVAILABLE',
          pricePerNight: {
            ...(minPrice && { gte: Number(minPrice) }),
            ...(maxPrice && { lte: Number(maxPrice) }),
          },
        },
      };
    }

    let orderBy: any = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
    if (sortBy === 'rating') orderBy = [{ reviews: { _count: 'desc' } }];
    if (sortBy === 'featured') orderBy = [{ isFeatured: 'desc' }];

    const [hotels, total] = await Promise.all([
      this.prisma.hotel.findMany({
        where,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          reviews: { select: { rating: true } },
          rooms: {
            where: { status: 'AVAILABLE' },
            select: { pricePerNight: true },
            orderBy: { pricePerNight: 'asc' },
            take: 1,
          },
          _count: { select: { rooms: true } },
        },
        skip,
        take: Number(limit),
        orderBy,
      }),
      this.prisma.hotel.count({ where }),
    ]);

    const enriched = hotels.map((h) => ({
      ...h,
      avgRating: h.reviews.length
        ? Number((h.reviews.reduce((s, r) => s + r.rating, 0) / h.reviews.length).toFixed(1))
        : null,
      reviewCount: h.reviews.length,
      startingFrom: h.rooms[0]?.pricePerNight ?? null,
    }));

    if (sortBy === 'price_asc') enriched.sort((a, b) => Number(a.startingFrom) - Number(b.startingFrom));
    if (sortBy === 'price_desc') enriched.sort((a, b) => Number(b.startingFrom) - Number(a.startingFrom));

    return { hotels: enriched, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) };
  }

  async suggestions(q: string) {
    const [cities, hotels] = await Promise.all([
      this.prisma.hotel.groupBy({
        by: ['city', 'country'],
        where: { status: 'APPROVED', city: { contains: q, mode: 'insensitive' } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      this.prisma.hotel.findMany({
        where: { status: 'APPROVED', name: { contains: q, mode: 'insensitive' } },
        select: { id: true, name: true, city: true, country: true },
        take: 5,
      }),
    ]);

    return {
      cities: cities.map((c) => ({ type: 'city', label: `${c.city}, ${c.country}`, count: c._count.id })),
      hotels: hotels.map((h) => ({ type: 'hotel', label: h.name, city: h.city, id: h.id })),
    };
  }
}
