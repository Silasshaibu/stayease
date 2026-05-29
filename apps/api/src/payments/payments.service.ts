import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16' as any,
    });
  }

  async initialize(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { hotel: true, room: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new BadRequestException();
    if (booking.paymentStatus === 'PAID') throw new BadRequestException('Already paid');

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${booking.hotel.name} — ${booking.room.name}`,
              description: `Check-in: ${booking.checkIn.toDateString()} | Check-out: ${booking.checkOut.toDateString()}`,
            },
            unit_amount: Math.round(Number(booking.totalAmount) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${this.config.get('FRONTEND_URL')}/dashboard/bookings?success=1&booking=${bookingId}`,
      cancel_url: `${this.config.get('FRONTEND_URL')}/checkout?cancelled=1&booking=${bookingId}`,
      metadata: { bookingId, userId },
    });

    await this.prisma.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        provider: 'STRIPE',
        providerRef: session.id,
        amount: booking.totalAmount,
        currency: 'usd',
        status: 'PENDING',
        metadata: { sessionId: session.id } as any,
      },
      update: { providerRef: session.id, status: 'PENDING' },
    });

    return { url: session.url, sessionId: session.id };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.CheckoutSession;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        await this.prisma.payment.updateMany({
          where: { providerRef: session.id },
          data: { status: 'PAID' },
        });
        await this.prisma.booking.update({
          where: { id: bookingId },
          data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
        });

        const booking = await this.prisma.booking.findUnique({
          where: { id: bookingId },
          include: { hotel: true },
        });
        if (booking) {
          await this.prisma.notification.create({
            data: {
              userId: booking.userId,
              title: 'Booking Confirmed',
              body: `Your booking at ${booking.hotel.name} is confirmed.`,
              type: 'BOOKING_CONFIRMED',
              link: `/dashboard/bookings/${bookingId}`,
            },
          });
        }
      }
    }

    return { received: true };
  }

  async refund(bookingId: string, userId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { bookingId } });
    if (!payment || payment.status !== 'PAID') throw new BadRequestException('Cannot refund');

    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.userId !== userId) throw new BadRequestException();

    if (payment.providerRef) {
      const session = await this.stripe.checkout.sessions.retrieve(payment.providerRef);
      if (session.payment_intent) {
        await this.stripe.refunds.create({ payment_intent: session.payment_intent as string });
      }
    }

    await this.prisma.payment.update({ where: { bookingId }, data: { status: 'REFUNDED' } });
    await this.prisma.booking.update({ where: { id: bookingId }, data: { paymentStatus: 'REFUNDED' } });

    return { message: 'Refund initiated' };
  }
}
