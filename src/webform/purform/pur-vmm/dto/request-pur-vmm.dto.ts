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
import { CreatePurVmmScmusrDto } from '../purvmm_scmusr/dto/create-purvmm_scmusr.dto';
import { RequestPurvmmScmuserDto } from '../purvmm_scmusr/dto/request-purvmm_scmusr.dto';

export class RequestPurvmmFormDto extends PickType(CreateFormDto, [
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
    REQTYPE: string;

    @IsOptional()
    @IsString()
    VENDGROUPTYPE?: string;

    @IsNotEmpty()
    @IsString()
    VENDCODE: string;

    @IsNotEmpty()
    @IsString()
    VENDNAME: string;

    @IsNotEmpty()
    @IsString()
    ADDRESS1_EN: string;

    @IsOptional()
    @IsString()
    ADDRESS2_EN?: string;

    @IsOptional()
    @IsString()
    CITY_EN?: string;

    @IsOptional()
    @IsString()
    STATE_EN?: string;

    @IsOptional()
    @IsString()
    COUNTRY_EN?: string;

    @IsOptional()
    @IsString()
    POSTCODE_EN?: string;

    @IsOptional()
    @IsString()
    ADDRESS_TH?: string;

    @IsOptional()
    @IsString()
    VENDCAT?: string;

    @IsOptional()
    @IsString()
    TAXID?: string;

    @IsOptional()
    @IsString()
    CANO?: string;

    @IsOptional()
    @IsString()
    BANO?: string;

    @IsOptional()
    @IsString()
    CURCODE?: string;

    @IsOptional()
    @IsString()
    VPAYTO?: string;

    @IsOptional()
    @IsString()
    VTYPE?: string;

    @IsOptional()
    @IsString()
    VPAYTY?: string;

    @IsOptional()
    @IsString()
    TERMCODE?: string;

    @IsOptional()
    @IsString()
    V1TIME?: string;

    @IsOptional()
    @IsString()
    VNALPH?: string;

    @IsOptional()
    @IsString()
    CONTACT?: string;

    @IsOptional()
    @IsString()
    EMAIL?: string;

    @IsOptional()
    @IsString()
    WEBSITE?: string;

    @IsOptional()
    @IsString()
    TELNO?: string;

    @IsOptional()
    @IsString()
    FAX?: string;

    @IsOptional()
    @IsString()
    ACCNUMBER?: string;

    @IsOptional()
    @IsString()
    BANKNAME?: string;

    @IsOptional()
    @IsString()
    BRANCH?: string;

    @IsOptional()
    @IsString()
    BANKADDR?: string;

    @IsOptional()
    @IsString()
    ATTACH_OTHER?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestPurvmmScmuserDto)
    SCMUSER?: RequestPurvmmScmuserDto[];
}
