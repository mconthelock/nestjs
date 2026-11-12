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

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NRUNNO: number;

    @IsString()
    EMPCOD: string;

    @IsString()
    MARSTT: string;

    @IsString()
    MARSTE: string;

    @IsString()
    FAMMRN: string;

    @IsNumber()
    @Type(() => Date)
    FAMMRD: Date;

    @IsString()
    FAMSNA: string;

    @IsString()
    FAMSTX: string;

    @IsNumber()
    @Type(() => Number)
    FAMCHI: number;

    @IsNumber()
    @Type(() => Number)
    C1NED: number;

    @IsNumber()
    @Type(() => Number)
    C1IED: number;

    @IsNumber()
    @Type(() => Number)
    C2NED: number;

    @IsNumber()
    @Type(() => Number)
    C2IED: number;

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
    TAXPRG: number;

    @IsNumber()
    @Type(() => Number)
    TAXDIS: number;

    @IsNumber()
    @Type(() => Number)
    TAXINS: number;

    @IsNumber()
    @Type(() => Number)
    TAXINH: number;

    @IsNumber()
    @Type(() => Number)
    TAXINP: number;

    @IsNumber()
    @Type(() => Number)
    TAXRMF: number;

    @IsNumber()
    @Type(() => Number)
    TAXANU: number;

    @IsNumber()
    @Type(() => Number)
    TAXINL: number;

    @IsNumber()
    @Type(() => Number)
    TAXLTF: number;

    @IsNumber()
    @Type(() => Number)
    TAXEDU: number;

    @IsNumber()
    @Type(() => Number)
    TAXDON: number;

    @IsNumber()
    @Type(() => Number)
    TAXOT1: number;

    @IsNumber()
    @Type(() => Number)
    TAXOT2: number;
}
