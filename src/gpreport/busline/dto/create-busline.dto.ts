import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateBuslineDto {
  @IsString()
  BUSNAME: string;

  @IsString()
  BUSTYPE: string;

  @IsString()
  BUSSTATUS: string;

  @Type(() => Number)
  @IsNumber()
  BUSSEAT: number;

  @IsString()
  IS_CHONBURI: string;
}
