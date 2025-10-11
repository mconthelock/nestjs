import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
import { createGroupDto } from './create.dto';
export class updateInqGroupDto extends createGroupDto {}
