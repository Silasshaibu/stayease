import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelDto, UpdateHotelDto, HotelPolicyDto } from './dto/hotel.dto';

const hotelInclude = {
  images: true,
  owner: { select: { id: true, firstName: true, lastName: true, email: true } },
  reviews: { select: { rating: true } },
  policies: true,
  _count: { select: { rooms: true, bookings: true } },
};

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateHotelDto) {
    const slug = dto.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    return this.prisma.hotel.create({
      data: { ...dto, ownerId, slug },
      include: hotelInclude,
    });
  }

  async findAll(query: { city?: string; country?: string; page?: number; limit?: number }) {
    const { city, country, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { status: 'APPROVED' };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (country) where.country = { contains: country, mode: 'insensitive' };

    const [hotels, total] = await Promise.all([
      this.prisma.hotel.findMany({
        where,
        include: hotelInclude,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.hotel.count({ where }),
    ]);

    return { hotels, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(idOrSlug: string) {
    const hotel = await this.prisma.hotel.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }], status: 'APPROVED' },
      include: {
        ...hotelInclude,
        rooms: {
          where: { status: 'AVAILABLE' },
          include: { images: true, inventory: true },
        },
      },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  async update(id: string, ownerId: string, dto: UpdateHotelDto) {
    await this.assertOwner(id, ownerId);
    return this.prisma.hotel.update({ where: { id }, data: dto, include: hotelInclude });
  }

  async remove(id: string, ownerId: string) {
    await this.assertOwner(id, ownerId);
    await this.prisma.hotel.delete({ where: { id } });
    return { message: 'Hotel deleted' };
  }

  async upsertPolicy(id: string, ownerId: string, dto: HotelPolicyDto) {
    await this.assertOwner(id, ownerId);
    return this.prisma.hotelPolicy.upsert({
      where: { hotelId: id },
      create: { hotelId: id, ...dto },
      update: dto,
    });
  }

  async getOwnerHotels(ownerId: string) {
    return this.prisma.hotel.findMany({
      where: { ownerId },
      include: hotelInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFeatured() {
    return this.prisma.hotel.findMany({
      where: { status: 'APPROVED', isFeatured: true },
      include: hotelInclude,
      take: 8,
    });
  }

  private async assertOwner(hotelId: string, ownerId: string) {
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (hotel.ownerId !== ownerId) throw new ForbiddenException();
  }
}
