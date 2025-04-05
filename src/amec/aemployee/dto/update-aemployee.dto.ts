import { PartialType } from '@nestjs/mapped-types';
import { CreateAemployeeDto } from './create-aemployee.dto';

export class UpdateAemployeeDto extends PartialType(CreateAemployeeDto) {}
