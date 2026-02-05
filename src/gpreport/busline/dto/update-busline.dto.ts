import { PartialType } from '@nestjs/swagger';
import { CreateBuslineDto } from './create-busline.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBuslineDto extends PartialType(CreateBuslineDto) {
  @Type(() => Number)
  @IsNumber()
  BUSID: number;
}
