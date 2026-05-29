import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty() @IsString() hotelId: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() bookingId?: string;
  @ApiProperty() @IsInt() @Min(1) @Max(5) rating: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() comment?: string;
}
