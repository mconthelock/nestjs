import { PartialType } from '@nestjs/mapped-types';
import { CreateQaFileDto } from './create-qa_file.dto';

export class UpdateQaFileDto extends PartialType(CreateQaFileDto) {}
