import { PartialType } from '@nestjs/mapped-types';
import { CreateQaTypeDto } from './create-qa_type.dto';

export class UpdateQaTypeDto extends PartialType(CreateQaTypeDto) {}
