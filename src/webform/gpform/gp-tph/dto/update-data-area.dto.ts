import { PartialType } from '@nestjs/mapped-types';
import { CreateDataAreaDto } from './create-data-area.dto';

export class UpdateAreaDto extends PartialType(CreateDataAreaDto) {}