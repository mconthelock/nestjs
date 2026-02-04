import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBusstationDto {
  @IsString()
  STATION_NAME: string;

  @IsString()
  STATION_STATUS: string;

  @Type(() => Number)
  @IsNumber()
  BUSLINE: number;

  @IsString()
  WORKDAY_TIMEIN: string;

  @IsString()
  @IsOptional()
  NIGHT_TIMEIN?: string;

  @IsString()
  @IsOptional()
  HOLIDAY_TIMEIN?: string;
}
