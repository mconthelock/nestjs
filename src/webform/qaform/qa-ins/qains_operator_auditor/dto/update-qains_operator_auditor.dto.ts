import { PartialType } from '@nestjs/mapped-types';
import { CreateQainsOADto } from './create-qains_operator_auditor.dto';

export class UpdateQainsOADto extends PartialType(CreateQainsOADto) {}
