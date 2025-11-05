import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { createSchdDto } from './create.dto';
import { IsNumber } from 'class-validator';

export class updateSchdDto extends PartialType(createSchdDto) {
  @Type(() => Number)
  @IsNumber()
  TASKID: number;
}
