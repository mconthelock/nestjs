import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class CreateBusrouteDto {
  @IsString()
  BUSNAME: string;

  @IsString()
  BUSTYPE: string;

  @IsString()
  BUSTATUS: string;

  @IsString()
  IS_CHONBURI: string;
}
