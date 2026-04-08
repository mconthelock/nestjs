import { PartialType } from '@nestjs/swagger';
import { CreateAuditReportMasterDto } from './create-audit_report_master.dto';
import { IsNotEmpty } from 'class-validator';
export class UpdateAuditReportMasterConditionDto extends PartialType(
    CreateAuditReportMasterDto,
) {}

export class UpdateAuditReportMasterDto extends PartialType(
    CreateAuditReportMasterDto,
) {
    @IsNotEmpty()
    condition: UpdateAuditReportMasterConditionDto;
}
