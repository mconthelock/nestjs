import { IsNotEmpty, IsString } from 'class-validator';

export class DailyDispatchReportDto {
  @IsString()
  @IsNotEmpty()
  dispatch_id: string;
}