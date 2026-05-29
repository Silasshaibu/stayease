import { IsString, IsOptional, IsInt, IsArray, IsNumber, Min, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty() @IsString() hotelId: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsNumber() pricePerNight: number;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(1) capacity?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() bedType?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() size?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() @IsString({ each: true }) amenities?: string[];
}

export class UpdateRoomDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() pricePerNight?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(1) capacity?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() bedType?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() size?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() @IsString({ each: true }) amenities?: string[];
}

export class UpdateInventoryDto {
  @ApiProperty() @IsDateString() date: string;
  @ApiProperty() @IsInt() @Min(0) availableRooms: number;
  @ApiProperty({ required: false }) @IsOptional() isBlocked?: boolean;
}
