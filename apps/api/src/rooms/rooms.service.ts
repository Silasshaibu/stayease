import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto, UpdateInventoryDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateRoomDto) {
    await this.assertHotelOwner(dto.hotelId, ownerId);
    return this.prisma.room.create({
      data: dto,
      include: { images: true, inventory: true },
    });
  }

  async findByHotel(hotelId: string) {
    return this.prisma.room.findMany({
      where: { hotelId, status: 'AVAILABLE' },
      include: { images: true, inventory: true, pricing: true },
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { images: true, inventory: true, pricing: true, hotel: true },
    });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async update(id: string, ownerId: string, dto: UpdateRoomDto) {
    const room = await this.prisma.room.findUnique({ where: { id }, include: { hotel: true } });
    if (!room) throw new NotFoundException();
    if (room.hotel.ownerId !== ownerId) throw new ForbiddenException();
    return this.prisma.room.update({ where: { id }, data: dto, include: { images: true } });
  }

  async remove(id: string, ownerId: string) {
    const room = await this.prisma.room.findUnique({ where: { id }, include: { hotel: true } });
    if (!room) throw new NotFoundException();
    if (room.hotel.ownerId !== ownerId) throw new ForbiddenException();
    await this.prisma.room.delete({ where: { id } });
    return { message: 'Room deleted' };
  }

  async updateInventory(id: string, ownerId: string, dto: UpdateInventoryDto) {
    const room = await this.prisma.room.findUnique({ where: { id }, include: { hotel: true } });
    if (!room) throw new NotFoundException();
    if (room.hotel.ownerId !== ownerId) throw new ForbiddenException();

    const date = new Date(dto.date);
    return this.prisma.roomInventory.upsert({
      where: { roomId_date: { roomId: id, date } },
      create: { roomId: id, date, availableRooms: dto.availableRooms, isBlocked: dto.isBlocked ?? false },
      update: { availableRooms: dto.availableRooms, isBlocked: dto.isBlocked ?? false },
    });
  }

  async checkAvailability(roomId: string, checkIn: string, checkOut: string) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const blocked = await this.prisma.roomInventory.findFirst({
      where: {
        roomId,
        date: { gte: start, lt: end },
        OR: [{ availableRooms: { lte: 0 } }, { isBlocked: true }],
      },
    });

    const activeBookings = await this.prisma.booking.count({
      where: {
        roomId,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        checkIn: { lt: end },
        checkOut: { gt: start },
      },
    });

    return { available: !blocked && activeBookings === 0 };
  }

  private async assertHotelOwner(hotelId: string, ownerId: string) {
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (hotel.ownerId !== ownerId) throw new ForbiddenException();
  }
}
