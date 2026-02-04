import { PartialType } from '@nestjs/swagger';
import { CreateBusrouteDto } from './create-busstation.dto';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateBusrouteDto extends PartialType(CreateBusrouteDto) {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  BUSID?: number;
}
