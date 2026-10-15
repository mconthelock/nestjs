import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateIf,
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
    // ระบุตัวฟอร์ม — บังคับเฉพาะตอน isReturn = true
    @ValidateIf((o) => o.isReturn === true || o.isSave === true)
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NFRMNO?: number;

    @ValidateIf((o) => o.isReturn === true || o.isSave === true)
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VORGNO?: string;

    @ValidateIf((o) => o.isReturn === true || o.isSave === true)
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CYEAR?: string;

    @ValidateIf((o) => o.isReturn === true || o.isSave === true)
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CYEAR2?: string;

    @ValidateIf((o) => o.isReturn === true || o.isSave === true)
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NRUNNO?: number;

    @ValidateIf((o) => o.isReturn === true)
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    EMPNO: string;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NMODE: number;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VVENDOR: string;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VPLANNER: string;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VMATERIAL_CODE: string;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VMAKER: string;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VPART_NAME: string;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VMODEL_NAME: string;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VJOB_ITEM: string;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NCOMMITTEE: number;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NGROUP: number;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NTOTAL_PRES: number;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NTOTAL_NEW: number;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NTOTAL_COST: number;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NTOTAL_RATIO: number;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    DEFT_MONTH_START: Date;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    DEFT_MONTH_END: Date;

    @ValidateIf((o) => o.isDraft !== true && o.isSave !== true)
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
    @IsBoolean()
    @ToBoolean()
    isReturn?: boolean;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    DELETE_LISTS?: number[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreatePurPraReasonDto)
    REASONS?: CreatePurPraReasonDto[];
}
