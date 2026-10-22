import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PriceComparisonDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    FUNC: number;

    @IsNotEmpty()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @IsArray()
    ITEM: string[];

    @IsNotEmpty()
    @IsString()
    SYSTEM: string;
}

export class PriceComparisonPlannerDto extends PickType(PriceComparisonDto, [
    'SYSTEM',
] as const) {
    @IsNotEmpty()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @IsArray()
    PLANNER: string[];
}

export class PriceComparisonListDto {
    @IsOptional()
    @IsString()
    VREQNO?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NSTATUS?: number;

    @IsOptional()
    @IsString()
    VFORMNO?: string;

    @IsOptional()
    @IsString()
    CYEAR2?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NRUNNO?: number;
}

export class PriceComparisonItemDetailDto extends PickType(PriceComparisonDto, [
    'SYSTEM',
    'ITEM',
] as const) {}
