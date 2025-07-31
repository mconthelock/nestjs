import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
import { createDto } from './create.dto';
export class searchDto extends createDto {}
