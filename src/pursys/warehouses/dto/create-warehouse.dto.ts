import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWarehouseDto {
    @IsString()
    WHCODE: string;

    @IsString()
    WHNAME: string;

    @IsString()
    WHOWNER: string;

    @IsString()
    LOCATION: string;

    @IsString()
    IS_ACTIVE: string;

    @IsDate()
    @Type(() => Date)
    CREATED_AT: Date;

    @IsString()
    @IsOptional()
    @Type(() => Date)
    UPDATED_AT?: Date;

    @IsString()
    CREATED_BY: string;

    @IsString()
    @IsOptional()
    UPDATED_BY?: string;
}
