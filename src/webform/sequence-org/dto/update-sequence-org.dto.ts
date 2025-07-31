import { PartialType } from '@nestjs/mapped-types';
import { CreateSequenceOrgDto } from './create-sequence-org.dto';

export class UpdateSequenceOrgDto extends PartialType(CreateSequenceOrgDto) {}
