import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export const CALENDAR_DAY_TYPES = [
    'WORKDAY',
    'HOLIDAY',
    'WORKING_SATURDAY',
    'WEEKEND',
] as const;

export type CalendarDayType = (typeof CALENDAR_DAY_TYPES)[number];

export class UpdateCalendarDayDto {
    @ApiPropertyOptional({ example: 20260413, description: 'YYYYMMDD' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    WORKID?: number;

    @ApiProperty({ example: 1, enum: [0, 1] })
    @IsNotEmpty()
    @IsNumber()
    @IsIn([0, 1])
    @Type(() => Number)
    DAYOFF: number;

    @ApiProperty({ example: 0 })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(24)
    @Type(() => Number)
    WORKHOUR: number;

    @ApiProperty({ example: 8 })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(24)
    @Type(() => Number)
    WORKHOUROT: number;

    @ApiProperty({ example: 'HOLIDAY', enum: CALENDAR_DAY_TYPES })
    @IsNotEmpty()
    @IsEnum(CALENDAR_DAY_TYPES)
    DAY_TYPE: CalendarDayType;

    @ApiPropertyOptional({ example: 'วันสงกรานต์' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    TITLE?: string;

    @ApiPropertyOptional({ example: 'วันหยุดเทศกาลสงกรานต์ประจำปี' })
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
