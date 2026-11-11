import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PickType } from '@nestjs/swagger';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';

export class CreateTaxDto extends PickType(CreateFormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'REQBY',
    'DRAFT',
    'INPUTBY',
    'REMARK',
] as const) {
    @IsNumber()
    @Type(() => Number)
    NFRMNO: number;

    @IsString()
    VORGNO: string;

    @IsString()
    CYEAR: string;

    @IsString()
    CYEAR2: string;

    @IsNumber()
    @Type(() => Number)
    NRUNNO: number;

    @IsString()
    SEMPNO: string;

    @IsString()
    MARSTT: string;

    @IsString()
    MARSTE: string;

    @IsString()
    FAMMRD: string;

    @IsString()
    FAMSNA: string;

    @IsNumber()
    @Type(() => Number)
    FAMIED: number;

    @IsNumber()
    @Type(() => Number)
    FAMNED: number;

    @IsNumber()
    @Type(() => Number)
    FAMCHI: number;

    @IsString()
    TAXEMF: string;

    @IsString()
    TAXEMM: string;

    @IsString()
    TAXSFT: string;

    @IsString()
    TAXSPM: string;

    @IsNumber()
    @Type(() => Number)
    TAXDIS: number;

    @IsNumber()
    @Type(() => Number)
    TAXPREG: number;

    @IsNumber()
    @Type(() => Number)
    TAXINS: number;

    @IsNumber()
    @Type(() => Number)
    TAXSIN: number;

    @IsNumber()
    @Type(() => Number)
    TAXINH: number;

    @IsNumber()
    @Type(() => Number)
    TAXLTF: number;

    @IsNumber()
    @Type(() => Number)
    TAXRMF: number;

    @IsNumber()
    @Type(() => Number)
    TAXPENS: number;

    @IsNumber()
    @Type(() => Number)
    TAXFUND: number;

    @IsNumber()
    @Type(() => Number)
    TAXEDU: number;

    @IsNumber()
    @Type(() => Number)
    TAXDON: number;

    @IsNumber()
    @Type(() => Number)
    TAXINL: number;

    @IsNumber()
    @Type(() => Number)
    TAXINP: number;

    @IsNumber()
    @Type(() => Number)
    TAXISM: number;

    @IsNumber()
    @Type(() => Number)
    TAXOT1: number;

    @IsNumber()
    @Type(() => Number)
    TAXOT2: number;

    @IsNumber()
    @Type(() => Number)
    FAMIED1: number;

    @IsNumber()
    @Type(() => Number)
    FAMNED1: number;
}
