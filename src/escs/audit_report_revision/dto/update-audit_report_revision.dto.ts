import { PartialType } from '@nestjs/swagger';
import { CreateAuditReportRevisionDto } from './create-audit_report_revision.dto';

export class UpdateAuditReportRevisionDto extends PartialType(CreateAuditReportRevisionDto) {}
