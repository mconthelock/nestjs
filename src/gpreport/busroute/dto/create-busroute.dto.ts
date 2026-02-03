import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class CreateBusrouteDto {
  @IsNumber()
  @Type(() => Number)
  BUSID: number;

  @IsString()
  BUSNAME: string;

  @IsString()
  BUSTYPE: string;

  @IsString()
  BUSTATUS: string;

  @IsString()
  IS_CHONBURI: string;
}
