import { IntersectionType, PickType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateStampReqFormDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
] as const) {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    PURPOSE_ID?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PURPOSE_OTHER?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    SPOSCODE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    NAME_STAMP?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    REMARK?: string;

    @IsString()
    REQBY: string;

    @IsString()
    INPUTBY: string;

    @IsString()
    REQ_TYPE: string;

    @IsNumber()
    @Type(() => Number)
    REQ_QTY: number;
}

export class CreateStampReqDto extends PartialType(CreateStampReqFormDto) {}
