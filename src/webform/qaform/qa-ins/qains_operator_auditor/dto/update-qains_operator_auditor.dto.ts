import { PartialType } from '@nestjs/mapped-types';
import { CreateQainsOADto } from './create-qains_operator_auditor.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateQainsOADto extends PartialType(CreateQainsOADto) {}
