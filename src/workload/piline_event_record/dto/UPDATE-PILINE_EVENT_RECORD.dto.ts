import { Type } from 'class-transformer';
import {
    ValidateIf,
    IsDate,
    IsInt,
    Min,
    Max,
    IsString,
    MaxLength,
    Matches,
    IsOptional,
    IsIn,
} from 'class-validator';

export class UpdatePilineEventRecordDto {
    @ValidateIf((_, value) => value !== undefined)
    @Type(() => Date)
    @IsDate()
    EVENT_DATE?: Date;

    @ValidateIf((_, value) => value !== undefined)
    @IsInt()
    @Min(-999)
    @Max(999)
    RUN_NO?: number;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(10)
    @Matches(/\S/, { message: '$property must not be blank' })
    SHIFT?: string;

    @ValidateIf((_, value) => value !== undefined)
    @Type(() => Date)
    @IsDate()
    START_TIME?: Date;

    @ValidateIf((_, value) => value !== undefined)
    @Type(() => Date)
    @IsDate()
    END_TIME?: Date;

    @ValidateIf((_, value) => value !== undefined)
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    LOCATION_ID?: number;

    @IsOptional()
    @IsString()
    @MaxLength(6)
    SSECCODE?: string | null;

    @ValidateIf((_, value) => value !== undefined)
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    CAUSE_ID?: number;

    @ValidateIf((_, value) => value !== undefined)
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    PROBLEM_ID?: number;

    @ValidateIf((_, value) => value !== undefined)
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    INITIAL_ID?: number;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    DETAIL?: string | null;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(1)
    @Matches(/\S/, { message: '$property must not be blank' })
    @IsIn(['0', '1'])
    IS_NG?: string;

    @IsOptional()
    @IsString()
    @MaxLength(4)
    REF_RN_CYEAR2?: string | null;

    @IsOptional()
    @IsInt()
    @Min(-999999)
    @Max(999999)
    REF_RN_NRUNNO?: number | null;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    REMARK?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    RECORD_STATUS?: string | null;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(6)
    @Matches(/\S/, { message: '$property must not be blank' })
    CREATE_BY?: string;

    @ValidateIf((_, value) => value !== undefined)
    @Type(() => Date)
    @IsDate()
    CREATE_DATE?: Date;

    @IsOptional()
    @IsString()
    @MaxLength(6)
    UPDATE_BY?: string | null;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    UPDATE_DATE?: Date | null;
}
