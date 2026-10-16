import { Type } from 'class-transformer';
import {
    IsDateString,
    IsArray,
    ArrayMaxSize,
    IsDefined,
    IsIn,
    IsInt,
    IsObject,
    IsOptional,
    IsString,
    Matches,
    Max,
    MaxLength,
    Min,
    ValidateNested,
} from 'class-validator';

export class PilineInputNgDto {
    @IsString()
    @Matches(/\S/)
    @MaxLength(20)
    ID_TAG: string;

    @IsInt()
    @Min(1)
    @Max(999)
    QTY: number;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    MAT_LOT?: string;

    @IsString()
    @Matches(/\S/)
    @MaxLength(20)
    MAT_NO: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    REMARK_NG?: string;
}

export class PilineDeleteFileDto {
    @IsIn(['EVT','NG'])
    TYPEFILE: string;
    @IsInt()
    @Min(1)
    @Max(999)
    SEQ: number;
}

export class SavePilineEventInputDto {
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(10)
    @ValidateNested({ each: true })
    @Type(() => PilineDeleteFileDto)
    DELETE_FILES?: PilineDeleteFileDto[];

    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    @IsDateString({ strict: true })
    EVENT_DATE: string;

    @IsIn(['Day', 'Night'])
    SHIFT: string;

    @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
    START_TIME: string;

    @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
    END_TIME: string;

    @IsInt()
    @Min(0)
    @Max(Number.MAX_SAFE_INTEGER)
    LOCATION_ID: number;

    @IsString()
    @Matches(/\S/)
    @MaxLength(6)
    SSECCODE: string;

    @IsInt()
    @Min(0)
    @Max(Number.MAX_SAFE_INTEGER)
    CAUSE_ID: number;

    @IsInt()
    @Min(0)
    @Max(Number.MAX_SAFE_INTEGER)
    PROBLEM_ID: number;

    @IsInt()
    @Min(0)
    @Max(Number.MAX_SAFE_INTEGER)
    INITIAL_ID: number;

    @IsString()
    @Matches(/\S/)
    @MaxLength(1000)
    DETAIL: string;

    @IsIn(['0', '1'])
    IS_NG: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    REMARK?: string;

    @IsString()
    @Matches(/\S/)
    @MaxLength(6)
    CREATE_BY: string;

    // Conditional presence is enforced in the service; nested fields are always validated if provided.
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PilineInputNgDto)
    NG?: PilineInputNgDto;
}

export class PilineInputMultipartDto {
    @IsDefined()
    @IsString()
    @MaxLength(65536)
    payload: string;
}
