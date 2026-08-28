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
import { RequestPurevaScoreDto } from '../pureva_score/dto/request-pureva_score.dto';
import { RequestPurevaProfitTurnoverDto } from '../pureva_profit_turnover/dto/request-pureva_profit_turnover.dto';
import { RequestPurevaVendorRelationDto } from '../pureva_vendor_relation/dto/request-pureva_vendor_relation.dto';

export class RequestPurevaFormDto extends PickType(CreateFormDto, [
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
    OPERATION: string;

    @IsOptional()
    @IsString()
    VENDCODE?: string;

    @IsOptional()
    @IsString()
    UPSTATUS?: string;

    @IsNotEmpty()
    @IsString()
    VENDGROUP: string;

    @IsOptional()
    @IsString()
    VENDPURPOSE?: string;

    @IsOptional()
    @IsString()
    VENDTYPE?: string;

    @IsNotEmpty()
    @IsString()
    COMNAME: string;

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
    BANKNAME?: string;

    @IsOptional()
    @IsString()
    BRANCH?: string;

    @IsOptional()
    @IsString()
    BANKADDR?: string;

    @IsOptional()
    @IsString()
    ACCNUMBER?: string;

    @IsOptional()
    @IsString()
    TERMCODE?: string;

    @IsOptional()
    @IsString()
    CURCODE?: string;

    @IsOptional()
    @IsString()
    COMPLIANCE?: string;

    @IsOptional()
    @IsString()
    COMPLIANCE_OTHER?: string;

    @IsOptional()
    @IsString()
    BUSTYPE_REG?: string;

    @IsOptional()
    @IsString()
    BUSTYPE_SUB?: string;

    @IsOptional()
    @IsString()
    PRODCAT?: string;

    @IsOptional()
    @IsString()
    PRODCAT_OTHER?: string;

    @IsOptional()
    @IsString()
    LEGAL_STATUS?: string;

    @IsOptional()
    @IsString()
    CORPORATE_ID?: string;

    @IsOptional()
    @Transform(({ value }) =>
        value !== undefined && value !== null ? String(value) : value,
    )
    @IsString()
    TAX_ID?: string;

    @IsOptional()
    @IsString()
    CONCERNEDORG?: string;

    @IsOptional()
    @IsString()
    FY_AMOUNT?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    AMOUNT?: number;

    @IsOptional()
    @IsString()
    PUR_LEVEL?: string;

    @IsOptional()
    @IsString()
    PUR_STATUS?: string;

    @IsOptional()
    @IsString()
    VENDCAT?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    CAPITAL?: number;

    @IsOptional()
    @IsString()
    CAPITAL_CUR?: string;

    @IsOptional()
    @IsString()
    ESTABLISHED?: string;

    @IsOptional()
    @IsString()
    COM_TYPE?: string;

    @IsOptional()
    @IsString()
    COM_OTHER?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    EMPDIRECT?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    EMPINDIRECT?: number;

    @IsOptional()
    @IsString()
    AVGAGE?: string;

    @IsOptional()
    @IsString()
    QM_STATUS?: string;

    @IsOptional()
    @IsString()
    QM_REASON?: string;

    @IsOptional()
    @IsString()
    CSR_STATUS?: string;

    @IsOptional()
    @IsString()
    CSR_REASON?: string;

    @IsOptional()
    @IsString()
    ENV_STATUS?: string;

    @IsOptional()
    @IsString()
    ENV_REASON?: string;

    @IsOptional()
    @IsString()
    LABOR_STATUS?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    LABOR_ESTABLISH_DATE?: Date;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    LAND?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    FACTORY?: number;

    @IsOptional()
    @IsString()
    JUDGEMENT?: string;

    @IsOptional()
    @IsString()
    MJUDGEMENT?: string;

    @IsOptional()
    @IsString()
    ADDRESS1_EN?: string;

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
    POSTCODE_EN?: string;

    @IsOptional()
    @IsString()
    COUNTRY_EN?: string;

    @IsOptional()
    @IsString()
    ADDRESS_TH?: string;

    @IsString()
    @Transform(({ value }) => (Array.isArray(value) ? value.join('|') : value))
    @IsOptional()
    ATTACH_TYPE?: string;

    @IsOptional()
    @IsString()
    ATTACH_OTHER?: string;

    @IsOptional()
    @IsString()
    NVFNO?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestPurevaScoreDto)
    SCORES?: RequestPurevaScoreDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestPurevaProfitTurnoverDto)
    PROFIT_TURNOVERS?: RequestPurevaProfitTurnoverDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestPurevaVendorRelationDto)
    RELATIONS?: RequestPurevaVendorRelationDto[];
}
