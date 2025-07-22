import { PartialType } from '@nestjs/mapped-types';
import { CreateQainsFormDto } from './create-qains_form.dto';

export class UpdateQainsFormDto extends PartialType(CreateQainsFormDto) {}
