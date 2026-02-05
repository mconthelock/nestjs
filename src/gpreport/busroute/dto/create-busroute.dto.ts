import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateBusrouteDto {
  @Type(() => Number)
  @IsNumber()
  BUSLINE: number;

  @Type(() => Number)
  @IsNumber()
  STOPNO: number;

  @Type(() => Number)
  @IsNumber()
  NEXTSTOP: number;

  @Type(() => Number)
  @IsNumber()
  STATENO: number;

  @IsString()
  IS_START: string;
}
