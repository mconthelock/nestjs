import { Type } from 'class-transformer';
import {
    IsDefined,
    IsString,
    IsNotEmpty,
    MaxLength,
    IsInt,
    Min,
    Max,
    IsNumber,
    IsOptional,
    IsDateString,
    Matches,
    IsIn,
    IsArray,
    ArrayMaxSize,
    ArrayUnique,
    ValidateNested,
} from 'class-validator';

export class JigFormKeyDto {
    @Type(() => Number)
    @IsDefined()
    @IsInt()
    @Min(1)
    @Max(999)
    NFRMNO: number;
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MaxLength(6)
    VORGNO: string;
    @IsDefined()
    @IsString()
    @Matches(/^\d{2}$/)
    CYEAR: string;
    @IsDefined()
    @IsString()
    @Matches(/^\d{4}$/)
    CYEAR2: string;
    @Type(() => Number)
    @IsDefined()
    @IsInt()
    @Min(1)
    @Max(999999)
    NRUNNO: number;
}

export class CreateJigFormDto extends JigFormKeyDto {
    @IsDefined()
    @IsIn(['CREATE', 'INSPECTION'])
    FORM_TYPE: 'CREATE' | 'INSPECTION';
    @IsOptional()
    @Matches(/^\d{4}-(0[1-9]|1[0-2])-01$/)
    SCHEDULE_DATE?: string;
    @IsOptional()
    @IsDateString({ strict: true })
    CHECK_DATE?: string;
    @IsOptional()
    @IsString()
    @MaxLength(5)
    INSPECTOR_EMPNO?: string;
    @IsOptional()
    @IsString()
    @MaxLength(10)
    CREATE_BY?: string;
}

export class JigResultDto {
    @IsDefined()
    @IsInt()
    @Min(1)
    @Max(20)
    CHECK_SEQ: number;
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(-99999999.9999)
    @Max(99999999.9999)
    MEASURED_VALUE?: number;
    @IsOptional()
    @IsIn(['OK', 'NG'])
    RESULT?: 'OK' | 'NG';
}

export class JigNgDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MaxLength(1000)
    DEFECT_DETAIL: string;
    @IsOptional()
    @IsString()
    @MaxLength(100)
    ACCESS_METHOD?: string;
    @IsDefined()
    @IsDateString({ strict: true })
    PLAN_DATE: string;
    @IsOptional()
    @IsString()
    @MaxLength(200)
    LOCATION?: string;
}

export class SaveJigFormDto {
    @IsOptional()
    @IsDateString({ strict: true })
    CHECK_DATE?: string;
    @IsOptional()
    @IsString()
    @MaxLength(5)
    INSPECTOR_EMPNO?: string;
    @IsOptional()
    @IsString()
    @MaxLength(10)
    UPDATE_BY?: string;
    @IsDefined()
    @IsArray()
    @ArrayMaxSize(20)
    @ArrayUnique((item) => item.CHECK_SEQ)
    @ValidateNested({ each: true })
    @Type(() => JigResultDto)
    DETAILS: JigResultDto[];
    @IsOptional()
    @ValidateNested()
    @Type(() => JigNgDto)
    NG?: JigNgDto | null;
}

export class JigFileDto {
    @IsDefined()
    @IsInt()
    @Min(1)
    @Max(999999)
    FILE_SEQ: number;
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    FILE_NAME: string;
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MaxLength(1000)
    FILE_PATH: string;
    @IsOptional()
    @IsString()
    @MaxLength(100)
    FILE_TYPE?: string;
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(999999999999)
    FILE_SIZE?: number;
    @IsOptional()
    @IsString()
    @MaxLength(10)
    CREATE_BY?: string;
}

export class JigFormFileKeyDto extends JigFormKeyDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(999999)
    FILE_SEQ: number;
}
