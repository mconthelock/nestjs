import { PartialType } from '@nestjs/mapped-types';
import { createDetailDto } from './create.dto';
export class updateDetailDto extends PartialType(createDetailDto) {}
