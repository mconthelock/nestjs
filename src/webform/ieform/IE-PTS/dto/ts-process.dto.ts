import { applyDecorators } from '@nestjs/common';
import { OmitType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsDateString,
    IsDefined,
    IsEmpty,
    IsInt,
    IsOptional,
    IsString,
    Length,
    Matches,
    Max,
    MaxLength,
    Min,
    Validate,
    ValidateNested,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

const RequiredText = (max: number) =>
    applyDecorators(
        IsDefined(),
        IsString(),
        Length(1, max),
        Matches(/\S/),
        Transform(({ value }) =>
            typeof value === 'string' ? value.trim() : value,
        ),
    );
const OptionalText = (max: number) =>
    applyDecorators(IsOptional(), IsString(), MaxLength(max));
const TrimmedOptionalText = (max: number) =>
    applyDecorators(
        OptionalText(max),
        Transform(({ value }) =>
            typeof value === 'string' ? value.trim() || null : value,
        ),
    );

export class TsFormKeyDto {
    @IsDefined()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(9999)
    NFRMNO: number;

    @RequiredText(6)
    VORGNO: string;

    @IsDefined()
    @IsString()
    @Matches(/^\d{2}$/)
    CYEAR: string;

    @IsDefined()
    @IsString()
    @Matches(/^\d{4}$/)
    CYEAR2: string;

    @IsDefined()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(999999)
    NRUNNO: number;
}

export class TsHeaderDto {
    @RequiredText(3)
    SEQ: string;

    @OptionalText(9) DWGNO?: string | null;
    @OptionalText(3) GNO?: string | null;
    @OptionalText(3) LNO?: string | null;
    @OptionalText(2) REVISION?: string | null;
    @OptionalText(3) ITEMNO?: string | null;
    @IsOptional() @IsDateString({ strict: true }) INPUTDATE?: string | null;
    @OptionalText(5) EFFJUN?: string | null;
    @OptionalText(5) IDTAGJUN?: string | null;
    @OptionalText(4000) VDETAIL?: string | null;
    @OptionalText(1) TSFLAG?: string | null;
    @OptionalText(3) LNO2?: string | null;
    @OptionalText(5) PLANJUN?: string | null;
    @OptionalText(500) TSFLAG_DETAIL?: string | null;
    @OptionalText(2) PNO?: string | null;
}

export class TsDetailDto {
    @RequiredText(3) SEQ: string;
    @RequiredText(6) PROCID: string;
    @RequiredText(6) PROCID_OLD: string;
    @TrimmedOptionalText(5) TP_OLD?: string | null;
    @TrimmedOptionalText(6) TC_OLD?: string | null;
    @TrimmedOptionalText(5) TP?: string | null;
    @TrimmedOptionalText(6) TC?: string | null;
    @OptionalText(2) SEQ_PROC?: string | null;
    @OptionalText(9) DWG?: string | null;
    @OptionalText(3) GNO?: string | null;
    @OptionalText(7) LNO?: string | null;
}

export class TsFileDto {
    @IsDefined()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(99)
    ID: number;

    @OptionalText(200) FILENAME?: string | null;
}

@ValidatorConstraint({ name: 'attachmentFormPrecision', async: false })
class AttachmentFormPrecision implements ValidatorConstraintInterface {
    validate(files: TsFileDto[] | null, args: ValidationArguments) {
        return !files?.length || (args.object as TsFormKeyDto).NFRMNO <= 999;
    }
    defaultMessage() {
        return 'NFRMNO must be at most 999 when FILES is not empty (PROC_TSATTFILE.NUMBER(3))';
    }
}

export class InsertTsProcessDto extends TsFormKeyDto {
    @IsDefined()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => TsHeaderDto)
    HEADERS: TsHeaderDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TsDetailDto)
    DETAILS?: TsDetailDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TsFileDto)
    @Validate(AttachmentFormPrecision)
    FILES?: TsFileDto[];
}

export class AutoTsProcessItemDto extends OmitType(TsDetailDto, [
    'SEQ',
    'SEQ_PROC',
    'DWG',
    'GNO',
    'LNO',
] as const) {
    @RequiredText(9) DWG: string;
    @OptionalText(3)
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() || null : value,
    )
    GNO?: string | null;
    @OptionalText(3)
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() || null : value,
    )
    LNO?: string | null;
    @RequiredText(3) ITEM: string;
}

export class AutoInsertTsProcessDto extends OmitType(TsFormKeyDto, [
    'CYEAR2',
    'NRUNNO',
] as const) {
    // Keep these in validation metadata so the application's global whitelist
    // cannot silently discard a client-supplied generated reference.
    @IsEmpty() CYEAR2?: never;
    @IsEmpty() NRUNNO?: never;
    @RequiredText(6) REQUEST_BY: string;
    @RequiredText(6) INPUT_BY: string;
    @IsDefined()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => AutoTsProcessItemDto)
    ITEMS: AutoTsProcessItemDto[];
}
