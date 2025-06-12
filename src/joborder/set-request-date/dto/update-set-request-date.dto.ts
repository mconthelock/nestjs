import { PartialType } from '@nestjs/mapped-types';
import { UpsertSetRequestDateDto } from './create-set-request-date.dto';

export class UpdateSetRequestDateDto extends PartialType(UpsertSetRequestDateDto) {}
