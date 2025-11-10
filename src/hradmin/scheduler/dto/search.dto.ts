import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { createSchdDto } from './create.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class searchSchdDto extends PartialType(createSchdDto) {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  TASKID: number;
}
