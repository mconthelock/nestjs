import { IsString } from 'class-validator';

export class RunDailyScheduleDto {
  @IsString()
  update_by: string;
}