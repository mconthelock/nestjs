import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateBuspassengerDto {
  @IsString()
  EMPNO: string;

  @Type(() => Number)
  @IsNumber()
  STATENO: number;

  @Type(() => Number)
  @IsNumber()
  BUSSTOP: number;

  @Type(() => Date)
  @IsDate()
  UPDATE_DATE: Date;

  @IsString()
  UPDATE_BY: string;
}
