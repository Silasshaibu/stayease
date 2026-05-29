import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private bookings: BookingsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateBookingDto) {
    return this.bookings.create(user.id, dto);
  }

  @Get('me')
  myBookings(@CurrentUser() user: any) {
    return this.bookings.findMyBookings(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookings.findOne(id, user.id);
  }

  @Put(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookings.cancel(id, user.id);
  }

  @Get('hotel/:hotelId')
  getHotelBookings(@Param('hotelId') hotelId: string, @CurrentUser() user: any) {
    return this.bookings.getHotelBookings(hotelId, user.id);
  }
}
