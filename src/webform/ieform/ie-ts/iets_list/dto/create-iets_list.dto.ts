import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateIetsListDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    ID: number;

    @IsNotEmpty()
    @IsString()
    DWGNO: string;

    @IsOptional()
    @IsString()
    PRTNAME?: string;

    @IsOptional()
    @IsString()
    ITMNO?: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    QTY: number;

    @IsNotEmpty()
    @IsString()
    PROCESS: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    CUR_TP: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    CUR_TC: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    AF_TP: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    AF_TC: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    IE_TP?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    IE_TC?: number;
}
