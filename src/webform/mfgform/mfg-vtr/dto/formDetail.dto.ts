import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FormDetailDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    NFRMNO: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VORGNO: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CYEAR: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CYEAR2: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    NRUNNO: number;
}
