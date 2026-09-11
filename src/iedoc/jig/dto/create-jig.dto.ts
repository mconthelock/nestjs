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
} from 'class-validator';

export class CreateJigDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    JIG_NO: string;
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    JIG_NAME: string;
    @IsOptional()
    @IsString()
    @MaxLength(100)
    DWG?: string;
    @IsOptional()
    @IsString()
    @MaxLength(2)
    REV?: string;
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(99999)
    JIG_QTY?: number;
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(9999999999.99)
    PRICE?: number;
    @IsOptional()
    @IsString()
    @MaxLength(100)
    MAKER?: string;
    @IsOptional()
    @IsDateString({ strict: true })
    START_USE_DATE?: string;
    @IsOptional()
    @IsString()
    @MaxLength(50)
    ITEMNO?: string;
    @IsOptional()
    @IsString()
    @MaxLength(200)
    PARTS?: string;
    @IsOptional()
    @IsString()
    @MaxLength(50)
    PROCESS_CODE?: string;
    @IsOptional()
    @IsString()
    @MaxLength(100)
    LOCATION?: string;
    @IsOptional()
    @IsString()
    @MaxLength(5)
    PIC_EMPNO?: string;
    @IsDefined()
    @IsInt()
    @Min(1)
    @Max(999)
    INSPEC_PERIOD: number;
    @IsOptional()
    @IsDateString({ strict: true })
    NEXT_INSPEC_DATE?: string;
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    REMARK?: string;
    @IsOptional()
    @IsString()
    @MaxLength(10)
    CREATE_BY?: string;
}
