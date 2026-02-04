import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class CreateBusrouteDto {
  @IsString()
  STATION_NAME: string;

  @IsString()
  STATION_STATUS: string;

  @IsNumber()
  BUSLINE: number;

  @IsString()
  WORKDAY_TIMEIN: string;

  @IsString()
  WORKDAY_TIMEDROP: string;

  @IsString()
  @IsOptional()
  NIGHT_TIMEIN: string;

  @IsString()
  @IsOptional()
  NIGHT_TIMEDROP: string;

  @IsString()
  @IsOptional()
  HOLIDAY_TIMEIN: string;

  @IsString()
  @IsOptional()
  HOLIDAY_TIMEDROP: string;
}
