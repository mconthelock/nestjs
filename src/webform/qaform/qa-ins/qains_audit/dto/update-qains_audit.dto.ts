import { PartialType } from '@nestjs/swagger';
import { CreateQainsAuditDto } from './create-qains_audit.dto';

export class UpdateQainsAuditDto extends PartialType(CreateQainsAuditDto) {}
