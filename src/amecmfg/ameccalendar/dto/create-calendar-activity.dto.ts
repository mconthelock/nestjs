import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export const CALENDAR_ACTIVITY_CATEGORIES = [
    'EVENT',
    'TRAINING',
    'CEREMONY',
    'HEALTH',
    'ANNOUNCEMENT',
    'OTHER',
] as const;

export type CalendarActivityCategory = (typeof CALENDAR_ACTIVITY_CATEGORIES)[number];

export class CreateCalendarActivityDto {
    @ApiProperty({ example: 20260615, description: 'YYYYMMDD' })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    WORKID: number;

    @ApiPropertyOptional({ example: '2026-06-15' })
    @IsOptional()
    @IsString()
    DATE?: string;

    @ApiPropertyOptional({ example: 'TRAINING', enum: CALENDAR_ACTIVITY_CATEGORIES })
    @IsOptional()
    @IsEnum(CALENDAR_ACTIVITY_CATEGORIES)
    TYPE?: CalendarActivityCategory;

    @ApiPropertyOptional({ example: 'TRAINING', enum: CALENDAR_ACTIVITY_CATEGORIES })
    @IsOptional()
    @IsEnum(CALENDAR_ACTIVITY_CATEGORIES)
    CATEGORY?: CalendarActivityCategory;

    @ApiProperty({ example: 'ซ้อมหนีไฟประจำปี' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    TITLE: string;

    @ApiPropertyOptional({ example: 'เวลา 13:30 น. อาคาร 1' })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    DESCRIPTION?: string;

    @ApiPropertyOptional({ example: '24008' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    UPDATE_BY?: string;
}
