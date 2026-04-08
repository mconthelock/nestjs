import { Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from 'class-validator';
import { DataAuditReportMasterDto } from './data-audit_report_master.dto';
export class SaveAuditReportMasterDto {
    @IsNotEmpty()
    @IsString()
    reason: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    secid: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    total: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    incharge: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DataAuditReportMasterDto)
    list: DataAuditReportMasterDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DataAuditReportMasterDto)
    topic: DataAuditReportMasterDto[];
}
