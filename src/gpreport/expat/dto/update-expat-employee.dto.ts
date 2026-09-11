import { PartialType } from '@nestjs/mapped-types';
import { CreateExpatEmployeeDto } from './create-expat-employee.dto';

export class UpdateExpatEmployeeDto extends PartialType(
    CreateExpatEmployeeDto,
) {}