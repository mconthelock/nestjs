import { IsDateString, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { FireCheckDetailKeyDto } from './fire-check-key.dto';

export class CreateFireCheckDetailDto extends FireCheckDetailKeyDto {
    @IsOptional()
    @IsString()
    @MaxLength(20)
    GAGE?: string | null;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(-9999.99)
    @Max(9999.99)
    WEIGHT?: number | null;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    PIN?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    HOSE?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    CLEAN?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    DETAIL?: string | null;

    @IsOptional()
    @IsDateString({ strict: true })
    CHECK_DATE?: string | null;
}
