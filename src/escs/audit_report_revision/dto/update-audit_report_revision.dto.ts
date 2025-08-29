import { PartialType } from '@nestjs/swagger';
import { CreateESCSARRDto } from './create-audit_report_revision.dto';

export class UpdateESCSARRDto extends PartialType(CreateESCSARRDto) {}
