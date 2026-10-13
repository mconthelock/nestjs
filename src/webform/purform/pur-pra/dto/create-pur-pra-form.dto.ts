import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { CreatePurPraReasonDto } from './create-pur-pra-reason.dto';
import { PickType } from '@nestjs/swagger';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { ToBoolean } from 'src/common/utils/transform';

export class CreatePurPraFormDto extends PickType(CreateFormDto, [
    'INPUTBY',
    'REQBY',
    'REMARK',
    'DRAFT',
] as const) {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NMODE: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VVENDOR: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VPLANNER: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VMATERIAL_CODE: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VMAKER: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VPART_NAME: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VMODEL_NAME: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VJOB_ITEM: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NCOMMITTEE: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NGROUP: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NTOTAL_PRES: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NTOTAL_NEW: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NTOTAL_COST: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NTOTAL_RATIO: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    DEFT_MONTH_START: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    DEFT_MONTH_END: Date;

    @IsNotEmpty()
    @IsString()
    VEFT_TYPE: string;

    @IsOptional()
    @IsString()
    VEFT_TYPE_OTHER?: string;

    @IsOptional()
    @IsString()
    VDETAIL?: string;

    @IsOptional()
    @IsString()
    PRICE_COMPARE_NO?: string;

    @IsOptional()
    @IsBoolean()
    @ToBoolean()
    isDraft?: boolean;

    @IsOptional()
    @IsBoolean()
    @ToBoolean()
    isSave?: boolean;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreatePurPraReasonDto)
    REASONS?: CreatePurPraReasonDto[];
}
