import { Type } from 'class-transformer';
import {
    IsString,
    IsOptional,
    IsDate,
    IsNumber,
    IsNotEmpty,
} from 'class-validator';

export class CreateUniformRightDto {
    @IsString()
    EMPCOD: string;

    @IsNumber()
    @Type(() => Number)
    RIGHTQTY: number;

    @IsString()
    POLOSUIT: string;

    @IsString()
    SHORTSUIT: string;

    @IsString()
    LONGSUIT: string;

    @IsString()
    OFFICESUIT: string;

    @IsString()
    JUMPSUIT: string;

    @IsNumber()
    @Type(() => Number)
    DISCOUNT: number;
}
