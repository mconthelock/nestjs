import { PartialType } from '@nestjs/swagger';
import { CreateAuditReportHistoryDto } from './create-audit_report_history.dto';

export class UpdateAuditReportHistoryDto extends PartialType(CreateAuditReportHistoryDto) {}
