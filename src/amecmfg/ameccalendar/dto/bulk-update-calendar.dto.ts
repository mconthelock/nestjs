import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
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

export const CALENDAR_BULK_TYPES = [
    'HOLIDAY',
    'WORKING_SATURDAY',
    'WORKDAY',
    'EVENT',
] as const;

export type CalendarBulkType = (typeof CALENDAR_BULK_TYPES)[number];

export class BulkUpdateCalendarDto {
    @ApiProperty({ example: [20260413, 20260414, 20260415], type: [Number] })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(366)
    @IsNumber({}, { each: true })
    @Type(() => Number)
    WORKIDS: number[];

    @ApiProperty({ example: 'HOLIDAY', enum: CALENDAR_BULK_TYPES })
    @IsNotEmpty()
    @IsEnum(CALENDAR_BULK_TYPES)
    DAY_TYPE: CalendarBulkType;

    @ApiPropertyOptional({ example: 1, enum: [0, 1] })
    @IsOptional()
    @IsNumber()
    @IsIn([0, 1])
    @Type(() => Number)
    DAYOFF?: number;

    @ApiPropertyOptional({ example: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(24)
    @Type(() => Number)
    WORKHOUR?: number;

    @ApiPropertyOptional({ example: 8 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(24)
    @Type(() => Number)
    WORKHOUROT?: number;

    @ApiPropertyOptional({ example: 'วันหยุดเทศกาลสงกรานต์' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    TITLE?: string;

    @ApiPropertyOptional({ example: 'หยุดยาวประจำปี' })
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
