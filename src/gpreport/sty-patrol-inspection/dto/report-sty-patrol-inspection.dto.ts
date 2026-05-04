import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { StringToDate } from "src/common/utils/transform";

export class ReportStyPatrolInspectionDto {
    @IsOptional()
    @StringToDate()
    SDATE?: Date;

    @IsOptional()
    @StringToDate()
    EDATE?: Date;

    @IsOptional()
    @Type(() => String)
    @IsString()
    SECCODE?: string;

    @IsOptional()
    @Type(() => String)
    @IsString()
    CLASS?: string;
}