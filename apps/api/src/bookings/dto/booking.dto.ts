import { IsString, IsInt, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty() @IsString() hotelId: string;
  @ApiProperty() @IsString() roomId: string;
  @ApiProperty() @IsDateString() checkIn: string;
  @ApiProperty() @IsDateString() checkOut: string;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(1) guests?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() couponCode?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() guestNotes?: string;
}
