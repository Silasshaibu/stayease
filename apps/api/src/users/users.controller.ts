import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.users.getProfile(user.id);
  }

  @Put('profile')
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.users.updateProfile(user.id, dto);
  }

  @Get('wishlist')
  getWishlist(@CurrentUser() user: any) {
    return this.users.getWishlist(user.id);
  }

  @Post('wishlist/:hotelId')
  addToWishlist(@CurrentUser() user: any, @Param('hotelId') hotelId: string) {
    return this.users.addToWishlist(user.id, hotelId);
  }

  @Delete('wishlist/:hotelId')
  removeFromWishlist(@CurrentUser() user: any, @Param('hotelId') hotelId: string) {
    return this.users.removeFromWishlist(user.id, hotelId);
  }

  @Get('notifications')
  getNotifications(@CurrentUser() user: any) {
    return this.users.getNotifications(user.id);
  }

  @Put('notifications/read')
  markRead(@CurrentUser() user: any) {
    return this.users.markNotificationsRead(user.id);
  }
}
