import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { FormDto }  from "src/webform/form/dto/form.dto";

export class CreatePurevaFormDto extends PickType(FormDto,[
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) { 

    @IsOptional()
    @IsString()
    VENDCODE?: string;

    @IsNotEmpty()
    @IsString()
    OPERATION: string;

    @IsNotEmpty()
    @IsString()
    VENDGROUP: string;

    @IsNotEmpty()
    @IsString()
    COMNAME: string; 

    @IsOptional()
    @IsString()
    UPSTATUS?: string;

    @IsOptional()
    @IsString()
    VENDPURPOSE?: string;

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
    LEGAL_STATUS?: string;

    @IsOptional()
    @IsString()
    CORPORATE_ID?: string;

    @IsOptional()
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
    @IsString()
    ESTABLISHED?: string;

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
    ATTACH_TYPE?: string;

    @IsOptional()
    @IsString()
    ATTACH_OTHER?: string;

}


