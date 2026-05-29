import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async send(userId: string, title: string, body: string, type: string, link?: string) {
    return this.prisma.notification.create({ data: { userId, title, body, type, link } });
  }

  async sendToMany(userIds: string[], title: string, body: string, type: string) {
    return this.prisma.notification.createMany({
      data: userIds.map((userId) => ({ userId, title, body, type })),
    });
  }
}
