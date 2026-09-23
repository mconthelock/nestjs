import {
    IntersectionType,
    OmitType,
    PartialType,
    PickType,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
    ArrayMinSize,
    Validate,
} from 'class-validator';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
import { RequestResultChkDwgDto } from '../resultchkdwg/dto/request-resultchkdwg.dto';

export class RequestCNFormDto extends PickType(CreateFormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'REQBY',
    'DRAFT',
    'INPUTBY',
    'REMARK',
] as const) {
    @IsNotEmpty()
    @IsString()
    ACTION: string;

    @IsOptional()
    @IsString()
    TITLE?: string;

    @IsOptional()
    @IsString()
    ITEMNO?: string;

    @IsOptional()
    @IsString()
    SVENDNAME?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    CLSNO?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    RSNNO?: number;

    @IsOptional()
    @IsString()
    RSNOTHER?: string;

    @IsOptional()
    @IsString()
    PRDCTNAME?: string;

    @IsOptional()
    @IsString()
    DETTRANS?: string;

    @IsOptional()
    @IsString()
    BEFCHANGE?: string;

    @IsOptional()
    @IsString()
    AFTCHANGE?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    SUBMITDATE?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    INSPECDATE?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    EXPCHGDATE?: Date;

    @IsOptional()
    @IsString()
    INSPECRESULT?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    JDGMNTNO?: number;

    @IsOptional()
    @IsString()
    INSPECRECNO?: string;

    @IsOptional()
    @IsString()
    PRTNAME?: string;

    @IsOptional()
    @IsString()
    PURITEM?: string;

    @IsOptional()
    @IsString()
    INVNO?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    ORDQ?: number;

    @IsOptional()
    @IsString()
    JDGOTHER?: string;

    @IsOptional()
    @IsString()
    PRTLOC?: string;

    @IsOptional()
    @IsString()
    TRANSNO?: string;

    @IsOptional()
    @IsString()
    RQCNREF?: string;

    @IsOptional()
    @IsString()
    ORDERNO?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    MDATE?: Date;

    @IsOptional()
    @IsString()
    MSTATUS?: string;

    @IsOptional()
    @IsString()
    RADSEC?: string;

    @IsOptional()
    @IsString()
    SEC?: string;

    @IsOptional()
    @IsString()
    RADPROCAMEC?: string;

    @IsOptional()
    @IsString()
    RADOBJ?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestResultChkDwgDto)
    DWGNo?: RequestResultChkDwgDto[];
}
