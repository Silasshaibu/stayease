import { IsString, IsOptional, IsInt, IsArray, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateHotelDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() address: string;
  @ApiProperty() @IsString() city: string;
  @ApiProperty() @IsString() country: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() latitude?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() longitude?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(1) @Max(5) starRating?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() @IsString({ each: true }) amenities?: string[];
  @ApiProperty({ required: false }) @IsOptional() @IsString() checkInTime?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() checkOutTime?: string;
}

export class UpdateHotelDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() country?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() latitude?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() longitude?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(1) @Max(5) starRating?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() @IsString({ each: true }) amenities?: string[];
  @ApiProperty({ required: false }) @IsOptional() @IsString() checkInTime?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() checkOutTime?: string;
}

export class HotelPolicyDto {
  @ApiProperty({ required: false }) @IsOptional() @IsInt() cancellationDays?: number;
  @ApiProperty({ required: false }) @IsOptional() petAllowed?: boolean;
  @ApiProperty({ required: false }) @IsOptional() smokingAllowed?: boolean;
  @ApiProperty({ required: false }) @IsOptional() childrenAllowed?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsString() extraInfo?: string;
}
