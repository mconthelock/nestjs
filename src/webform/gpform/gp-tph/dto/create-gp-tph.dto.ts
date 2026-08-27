import { PartialType, PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { FormDto } from "src/webform/form/dto/form.dto";

export class CreateGpTphReqFormDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
] as const) {
    @IsOptional()
    @IsString()
    REQUEST_TYPE?: string;

    @IsString()
    REQUEST_SUB_TYPE?: string;

    @IsOptional()
    @IsString()
    PURPOSE?: string;

    @IsNumber()
    @Type(() => Number)
    LONGTERM_YEARS?: number;

    @IsDate()
    @Type(() => Date)
    PERMIT_START_DATE?: Date;

    @IsDate()
    @Type(() => Date)
    PERMIT_END_DATE?: Date;

    @IsOptional()
    @IsString()
    HELMET_STICKER?: string;

    @IsOptional()
    @IsString()
    PHOTO_PERMIT_BADGE?: string;

    @IsString()
    REQBY: string;

    @IsString()
    @IsNotEmpty()
    INPUTBY: string;

    @IsString()
    REMARK?: string;
}

export class CreateGpTphReqDto extends PartialType(CreateGpTphReqFormDto) { }