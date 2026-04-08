import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateAuditReportMasterDto } from './create-audit_report_master.dto';
import { Type } from 'class-transformer';

export class SearchAuditReportMasterDto extends PartialType(
    CreateAuditReportMasterDto,
) {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    ARM_STATUS?: number;
}
