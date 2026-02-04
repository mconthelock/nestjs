import { PartialType } from '@nestjs/swagger';
import { CreateBusstationDto } from './create-busstation.dto';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateBusstationDto extends PartialType(CreateBusstationDto) {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  STATION_ID?: number;
}
