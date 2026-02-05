import { IsNumber, IsString } from 'class-validator';

export class CreateBusstopDto {
  @IsString()
  STOP_NAME: string;

  @IsString()
  STOP_STATUS: string;

  @IsString()
  WORKDAY_TIMEIN: string;

  @IsString()
  NIGHT_TIMEIN: string;

  @IsString()
  HOLIDAY_TIMEIN: string;
}
