import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ESCSCreateUserItemStationDto {
  @IsNotEmpty()
  @IsString()
  US_USER: string;

  @IsNotEmpty()
  @IsString()
  US_ITEM: string;

  @IsNotEmpty()
  @IsString()
  US_STATION: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  US_STATION_NO: number;
}
