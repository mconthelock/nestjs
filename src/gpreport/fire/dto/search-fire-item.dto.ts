import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class SearchFireItemDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    search?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    FIRE_CODE?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    LOCATION?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    FTYPE?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    CAPACITY?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    AREA?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1)
    STATUS?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 20;
}

