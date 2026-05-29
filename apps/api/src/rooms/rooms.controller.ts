import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto, UpdateInventoryDto } from './dto/room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private rooms: RoomsService) {}

  @Get('hotel/:hotelId')
  findByHotel(@Param('hotelId') hotelId: string) {
    return this.rooms.findByHotel(hotelId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rooms.findOne(id);
  }

  @Get(':id/availability')
  checkAvailability(
    @Param('id') id: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.rooms.checkAvailability(id, checkIn, checkOut);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOTEL_OWNER' as any)
  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateRoomDto) {
    return this.rooms.create(user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOTEL_OWNER' as any)
  @Put(':id')
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateRoomDto) {
    return this.rooms.update(id, user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOTEL_OWNER' as any)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.rooms.remove(id, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOTEL_OWNER' as any)
  @Put(':id/inventory')
  updateInventory(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateInventoryDto) {
    return this.rooms.updateInventory(id, user.id, dto);
  }
}
