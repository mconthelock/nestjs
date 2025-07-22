import { PartialType } from '@nestjs/mapped-types';
import { CreateQainsOperatorAuditorDto } from './create-qains_operator_auditor.dto';

export class UpdateQainsOperatorAuditorDto extends PartialType(CreateQainsOperatorAuditorDto) {}
