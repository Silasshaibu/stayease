import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { CreateHotelDto, UpdateHotelDto, HotelPolicyDto } from './dto/hotel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private hotels: HotelsService) {}

  @Get('featured')
  getFeatured() {
    return this.hotels.getFeatured();
  }

  @Get()
  findAll(@Query() query: any) {
    return this.hotels.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotels.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOTEL_OWNER' as any)
  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateHotelDto) {
    return this.hotels.create(user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOTEL_OWNER' as any)
  @Put(':id')
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateHotelDto) {
    return this.hotels.update(id, user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOTEL_OWNER' as any)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.hotels.remove(id, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOTEL_OWNER' as any)
  @Put(':id/policy')
  upsertPolicy(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: HotelPolicyDto) {
    return this.hotels.upsertPolicy(id, user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOTEL_OWNER' as any)
  @Get('owner/my')
  getOwnerHotels(@CurrentUser() user: any) {
    return this.hotels.getOwnerHotels(user.id);
  }
}
