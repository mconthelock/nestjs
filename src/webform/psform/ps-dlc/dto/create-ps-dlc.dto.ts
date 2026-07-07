import { PartialType, PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateFormDto } from "src/webform/form/dto/create-form.dto";
import { Timestamp } from "typeorm";

export class CreatepsdlcFormDto extends PickType(CreateFormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'REQBY',
    'INPUTBY',
    'REMARK',
] as const){
    @IsNotEmpty()
    @Type(() => Date)
    CHANGE_DATE: Date;

    @IsString()
    @Type(() => String)
    CHANGE_SCHD: string;
    
    @IsString()
    @Type(() => String)
    CHANGE_STATUS: string;

    @IsOptional()
    @Type(() => Timestamp)
    ACTUAL_DATE?: Timestamp;

    @IsOptional()
    @IsString()
    @Type(() => String)
    ACTUAL_UPDATEBY?: string;

    @IsNotEmpty()
    DETAILS: CreatepsdlcDetailDto[];
}

export class CreatepsdlcDetailDto{
    @IsNumber()
    @Type(() => Number)
    SEQNO: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    DRAWING?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    ITEM?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    NEWCODE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    NEWFLAG?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    OLDCODE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    OLDFLAG?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    OLDSTATUS?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    OLDSPEC?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    REFERENCE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    REMARKTABLE?: string;
}

export class CreatePsdlcReqFormDto extends PartialType(CreatepsdlcFormDto) {}