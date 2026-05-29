import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN' as any)
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('stats')
  stats() {
    return this.admin.getDashboardStats();
  }

  @Get('users')
  getUsers(@Query('page') page: number, @Query('limit') limit: number) {
    return this.admin.getUsers(page, limit);
  }

  @Put('users/:id/role')
  setRole(@Param('id') id: string, @Body('role') role: string) {
    return this.admin.setUserRole(id, role);
  }

  @Get('hotels/pending')
  pendingHotels() {
    return this.admin.getPendingHotels();
  }

  @Put('hotels/:id/approve')
  approveHotel(@Param('id') id: string) {
    return this.admin.approveHotel(id);
  }

  @Put('hotels/:id/reject')
  rejectHotel(@Param('id') id: string) {
    return this.admin.rejectHotel(id);
  }

  @Get('bookings')
  getBookings(@Query('page') page: number, @Query('limit') limit: number) {
    return this.admin.getAllBookings(page, limit);
  }

  @Get('reports/revenue')
  revenueReport() {
    return this.admin.getRevenueReport();
  }
}
