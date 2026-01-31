import { Type } from 'class-transformer';
import { IsNumber, IsIn } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { createInqDto } from './create-inquiry.dto';

export class updateInqDto extends PartialType(createInqDto) {
  @IsNumber()
  @Type(() => Number)
  @IsIn([0, 1])
  INQ_LATEST: number;
}
