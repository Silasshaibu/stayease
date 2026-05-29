import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [users, hotels, bookings, revenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.hotel.count(),
      this.prisma.booking.count(),
      this.prisma.payment.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
    ]);

    const pendingHotels = await this.prisma.hotel.count({ where: { status: 'PENDING' } });
    const activeBookings = await this.prisma.booking.count({ where: { status: 'CONFIRMED' } });

    return {
      users,
      hotels,
      pendingHotels,
      bookings,
      activeBookings,
      totalRevenue: revenue._sum.amount ?? 0,
    };
  }

  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        select: { id: true, email: true, firstName: true, lastName: true, role: true, isVerified: true, createdAt: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return { users, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getPendingHotels() {
    return this.prisma.hotel.findMany({
      where: { status: 'PENDING' },
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, email: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async approveHotel(id: string) {
    return this.prisma.hotel.update({ where: { id }, data: { status: 'APPROVED' } });
  }

  async rejectHotel(id: string) {
    return this.prisma.hotel.update({ where: { id }, data: { status: 'REJECTED' } });
  }

  async getAllBookings(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          hotel: { select: { id: true, name: true, city: true } },
          room: { select: { id: true, name: true } },
          payment: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count(),
    ]);
    return { bookings, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getRevenueReport() {
    const monthly = await this.prisma.payment.groupBy({
      by: ['createdAt'],
      where: { status: 'PAID' },
      _sum: { amount: true },
    });
    return { monthly };
  }

  async setUserRole(userId: string, role: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();
    return this.prisma.user.update({ where: { id: userId }, data: { role: role as any } });
  }
}
