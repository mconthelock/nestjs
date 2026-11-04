import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFireItemDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    FIRE_CODE: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    LOCATION?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    FTYPE?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    CAPACITY?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    AREA?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(1)
    STATUS?: string | null;
}
