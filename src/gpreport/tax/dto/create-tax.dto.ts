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
    NRUNNO?: number;

    @IsString()
    EMPCOD: string;

    @IsString()
    MARSTT: string;

    @IsString()
    MARSTE: string;

    @IsOptional()
    @IsString()
    FAMMRN?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Date)
    FAMMRD?: Date;

    @IsOptional()
    @IsString()
    FAMSNA?: string;

    @IsOptional()
    @IsString()
    FAMSTX?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    C1NED?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    C1IED?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    C2NED?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    C2IED?: number;

    @IsOptional()
    @IsString()
    TAXEMF?: string;

    @IsOptional()
    @IsString()
    TAXEMM?: string;

    @IsOptional()
    @IsString()
    TAXSFT?: string;

    @IsOptional()
    @IsString()
    TAXSPM?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    TAXPRG?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    TAXDIS?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    TAXINS?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    TAXINH?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    TAXINP?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    TAXRMF?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    TAXANU?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    TAXINL?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    TAXLTF?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    TAXEDU?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    TAXDON?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    TAXOT1?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    TAXOT2?: number;
}
