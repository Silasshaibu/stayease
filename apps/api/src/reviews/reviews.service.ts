import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const hotel = await this.prisma.hotel.findUnique({ where: { id: dto.hotelId } });
    if (!hotel) throw new NotFoundException('Hotel not found');

    const existing = await this.prisma.review.findUnique({
      where: { hotelId_userId: { hotelId: dto.hotelId, userId } },
    });
    if (existing) throw new ConflictException('Already reviewed this hotel');

    return this.prisma.review.create({
      data: { userId, hotelId: dto.hotelId, bookingId: dto.bookingId, rating: dto.rating, comment: dto.comment },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    });
  }

  async findByHotel(hotelId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { hotelId, isVisible: true },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const avg = reviews.length
      ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
      : 0;

    return { reviews, averageRating: avg, totalReviews: reviews.length };
  }

  async findMyReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      include: { hotel: { select: { id: true, name: true, city: true, images: { where: { isPrimary: true }, take: 1 } } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
