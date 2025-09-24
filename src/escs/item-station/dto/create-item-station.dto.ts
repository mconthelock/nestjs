import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateESCSItemStationDto {
  @IsNotEmpty()
  @IsString()
  ITS_ITEM: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ITS_NO: number;

  @IsNotEmpty()
  @IsString()
  ITS_STATION_NAME: string;
  
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ITS_USERUPDATE: number;
}
