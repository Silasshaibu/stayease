import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/booking.dto';

const SERVICE_FEE_RATE = 0.05;

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
      include: { pricing: true },
    });
    if (!room || room.hotelId !== dto.hotelId) throw new NotFoundException('Room not found');

    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);
    if (checkOut <= checkIn) throw new BadRequestException('Invalid dates');

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    const conflict = await this.prisma.booking.findFirst({
      where: {
        roomId: dto.roomId,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        checkIn: { lt: checkOut },
        checkOut: { gt: checkIn },
      },
    });
    if (conflict) throw new BadRequestException('Room not available for selected dates');

    const pricePerNight = Number(room.pricePerNight);
    const subtotal = pricePerNight * nights;
    let discount = 0;
    let couponId: string | undefined;

    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: dto.couponCode } });
      if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
          discount = coupon.isPercentage
            ? subtotal * (Number(coupon.discount) / 100)
            : Math.min(Number(coupon.discount), subtotal);
          couponId = coupon.id;
          await this.prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    const serviceFee = subtotal * SERVICE_FEE_RATE;
    const totalAmount = subtotal - discount + serviceFee;

    return this.prisma.booking.create({
      data: {
        userId,
        hotelId: dto.hotelId,
        roomId: dto.roomId,
        couponId,
        checkIn,
        checkOut,
        nights,
        guests: dto.guests ?? 1,
        pricePerNight,
        subtotal,
        discount,
        serviceFee,
        totalAmount,
        guestNotes: dto.guestNotes,
      },
      include: {
        hotel: { select: { name: true, city: true } },
        room: { select: { name: true } },
        payment: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        hotel: { include: { images: true } },
        room: { include: { images: true } },
        payment: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!booking) throw new NotFoundException();
    if (booking.userId !== userId) throw new ForbiddenException();
    return booking;
  }

  async findMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        hotel: { select: { name: true, city: true, images: { where: { isPrimary: true }, take: 1 } } },
        room: { select: { name: true } },
        payment: { select: { status: true, provider: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancel(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException();
    if (booking.userId !== userId) throw new ForbiddenException();
    if (['CANCELLED', 'CHECKED_OUT'].includes(booking.status)) {
      throw new BadRequestException('Booking cannot be cancelled');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async getHotelBookings(hotelId: string, ownerId: string) {
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel || hotel.ownerId !== ownerId) throw new ForbiddenException();

    return this.prisma.booking.findMany({
      where: { hotelId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        room: { select: { name: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.booking.update({ where: { id }, data: { status: status as any } });
  }
}
