import { PickType } from '@nestjs/swagger';
import { CreateIetsListDto } from './create-iets_list.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateIetsListDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    ID: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    CUR_TP: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    CUR_TC: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    AF_TP: number;

    @IsOptional()
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
