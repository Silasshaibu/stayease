import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, avatar: true, role: true, isVerified: true, createdAt: true,
        wallet: { select: { balance: true, currency: true } },
      },
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, avatar: true, role: true,
      },
    });
  }

  async getWishlist(userId: string) {
    return this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        hotel: {
          select: {
            id: true, name: true, city: true, country: true, starRating: true,
            images: { where: { isPrimary: true }, take: 1 },
            reviews: { select: { rating: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addToWishlist(userId: string, hotelId: string) {
    return this.prisma.wishlistItem.upsert({
      where: { userId_hotelId: { userId, hotelId } },
      create: { userId, hotelId },
      update: {},
    });
  }

  async removeFromWishlist(userId: string, hotelId: string) {
    await this.prisma.wishlistItem.deleteMany({ where: { userId, hotelId } });
    return { message: 'Removed from wishlist' };
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markNotificationsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { message: 'Notifications marked as read' };
  }
}
