import { PartialType } from '@nestjs/swagger';
import { CreateMfgVtrDto } from './create-mfg-vtr.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMfgVtrDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    NFRMNO: number;

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    VORGNO: string;

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    CYEAR: string;

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    CYEAR2: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    NRUNNO: number;

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    STATUS: string;
}
