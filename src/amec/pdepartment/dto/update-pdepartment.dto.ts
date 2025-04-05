import { PartialType } from '@nestjs/mapped-types';
import { CreatePdepartmentDto } from './create-pdepartment.dto';

export class UpdatePdepartmentDto extends PartialType(CreatePdepartmentDto) {}
