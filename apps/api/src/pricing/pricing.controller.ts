import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { CreatePricingRuleDto } from './dto/pricing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Pricing')
@Controller('pricing')
export class PricingController {
  constructor(private pricing: PricingService) {}

  @Get('hotel/:hotelId')
  getRulesForHotel(@Param('hotelId') hotelId: string) {
    return this.pricing.getRulesForHotel(hotelId);
  }

  @Get('effective')
  getEffectivePrice(
    @Query('roomId') roomId: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.pricing.getEffectivePrice(roomId, checkIn, checkOut);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOTEL_OWNER' as any)
  @Post('rules')
  createRule(@Body() dto: CreatePricingRuleDto) {
    return this.pricing.createRule(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOTEL_OWNER' as any)
  @Delete('rules/:id')
  deleteRule(@Param('id') id: string) {
    return this.pricing.deleteRule(id);
  }
}
