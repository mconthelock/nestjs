import { PartialType, PickType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { FormDto } from "src/webform/form/dto/form.dto";

function ParseJsonArray() {
    return Transform(({ value }) => {
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
        return value;
    });
}

export class CreateGpTphReqFormDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
] as const) {
    @IsString()
    REQBY: string;

    @IsString()
    @IsNotEmpty()
    INPUTBY: string;

    @IsString()
    REMARK?: string;

    @IsOptional()
    @IsString()
    REQUEST_TYPE?: string;

    @IsNotEmpty()
    @IsString()
    REQUEST_SUB_TYPE?: string;

    @IsNotEmpty()
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

    @IsNotEmpty()
    DETAILS: CreateGpTphlistApplicantDto[];

    @IsNotEmpty()
    @Type(() => Number)
    @IsArray()
    @IsNumber({}, { each: true })
    AREA_ID: number[];

}
export class CreateGpTphlistApplicantDto {

    @IsOptional()
    @IsString()
    CYEAR2?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NRUNNO?: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    SEQ_NO?: number;

    @IsOptional()
    @IsString()
    APPLICANT_TYPE?: string;

    @IsOptional()
    @IsString()
    EMP_CODE?: string;

    @IsOptional()
    @IsString()
    APPLICANT_NAME?: string;

    @IsOptional()
    @IsString()
    COMPANY_NAME?: string;

}

export class CreateGpTphReqDto extends PartialType(CreateGpTphReqFormDto) { }