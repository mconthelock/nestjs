import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import {
    CALENDAR_ACTIVITY_CATEGORIES,
    CalendarActivityCategory,
} from './create-calendar-activity.dto';

export class UpdateCalendarActivityDto {
    @ApiPropertyOptional({ example: 20260615, description: 'YYYYMMDD' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    WORKID?: number;

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

    @ApiPropertyOptional({ example: 'ซ้อมหนีไฟประจำปี (รอบบ่าย)' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    TITLE?: string;

    @ApiPropertyOptional({ example: 'เวลา 14:00 น. อาคาร 1' })
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
