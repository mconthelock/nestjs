import { PartialType } from '@nestjs/swagger';
import { CreateBusstopDto } from './create-busstop.dto';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBusstopDto extends PartialType(CreateBusstopDto) {
  @Type(() => Number)
  @IsNumber()
  STOP_ID: number;
}
