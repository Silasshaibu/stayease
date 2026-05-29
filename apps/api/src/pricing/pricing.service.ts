import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePricingRuleDto } from './dto/pricing.dto';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async createRule(dto: CreatePricingRuleDto) {
    return this.prisma.pricingRule.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
  }

  async getRulesForHotel(hotelId: string) {
    return this.prisma.pricingRule.findMany({
      where: { room: { hotelId }, isActive: true },
      include: { room: { select: { id: true, name: true } } },
      orderBy: { startDate: 'asc' },
    });
  }

  async getEffectivePrice(roomId: string, checkIn: string, checkOut: string): Promise<number> {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const rules = await this.prisma.pricingRule.findMany({
      where: {
        roomId,
        isActive: true,
        startDate: { lte: end },
        endDate: { gte: start },
      },
    });

    if (!rules.length) return Number(room.pricePerNight);

    const topRule = rules.sort((a, b) => Number(b.priceMultiplier) - Number(a.priceMultiplier))[0];
    return Number(room.pricePerNight) * Number(topRule.priceMultiplier);
  }

  async deleteRule(id: string) {
    await this.prisma.pricingRule.delete({ where: { id } });
    return { message: 'Rule deleted' };
  }
}
