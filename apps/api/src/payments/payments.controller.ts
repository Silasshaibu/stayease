import { Controller, Post, Body, Param, Req, UseGuards, Headers, RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('initialize/:bookingId')
  initialize(@Param('bookingId') bookingId: string, @CurrentUser() user: any) {
    return this.payments.initialize(bookingId, user.id);
  }

  @Post('webhook')
  webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    return this.payments.handleWebhook(req.rawBody!, sig);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refund/:bookingId')
  refund(@Param('bookingId') bookingId: string, @CurrentUser() user: any) {
    return this.payments.refund(bookingId, user.id);
  }
}
