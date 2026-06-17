import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateFormDto } from "src/webform/form/dto/create-form.dto";
import { FormDto } from "src/webform/form/dto/form.dto";

export class CreatePSrpFormDto extends PickType(CreateFormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'REQBY',
    'INPUTBY',
    'REMARK',
] as const){
    @IsNumber()
    @Type(() => Number)
    REQ_TYPE: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    REASON?: string;

    @IsNotEmpty()
    DETAILS: CreatePsrpListDto[];

}

export class CreatePsrpListDto {
    @IsNumber()
    @Type(() => Number)
    LINEID: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PURCODE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    DESCRIPTION?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    DRAWING?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    ORDERNO?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    ITEMNO?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    ADDREESS?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    RETURNTO?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    QTY?: number;
    
    @IsOptional()
    @IsString()
    @Type(() => String)
    ISSUECARD?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    ISSUESEQ?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PRODUCTION?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    REMARKTABLE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    ISSUETO?: string;
}

export class PsrReportDto{
    @IsOptional()
    @IsString()
    @Type(() => String)
    fromDate?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    toDate?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    pItem?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    issueNo?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    issueTo?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    fromSch?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    toSch?: string;
}



export class CreatePsrpReqFormDto extends PartialType(CreatePSrpFormDto) {}