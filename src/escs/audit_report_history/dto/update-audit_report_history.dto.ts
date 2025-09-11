import { PartialType } from '@nestjs/swagger';
import { CreateESCSARHDto } from './create-audit_report_history.dto';

export class UpdateESCSARHDto extends PartialType(CreateESCSARHDto) {}
