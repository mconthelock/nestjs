import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDpmsPlCaseListDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NISSUEREV_ID: number;

    @IsNotEmpty()
    @IsString()
    VMFGNO: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NSEQ: number;

    @IsNotEmpty()
    @IsString()
    VCASE: string;

    @IsNotEmpty()
    @IsString()
    VPACKSTYLE: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NNETWEIGHT: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NGROSSWEIGHT: number;

    @IsNotEmpty()
    @IsString()
    VWIDTH: string;

    @IsNotEmpty()
    @IsString()
    VLENGTH: string;

    @IsNotEmpty()
    @IsString()
    VHEIGHT: string;
}
