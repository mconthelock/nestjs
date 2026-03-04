import {  IsString } from 'class-validator';

export class BuildDailyFirstDto {
  @IsString()
  workdate: string;             // "YYYY-MM-DD"
  
  @IsString()
  dispatch_type: 'O' | 'W';      // 'O' = OT  | W = WORK

  @IsString()
  shift: 'D' | 'N' | 'H';  // D =OT DAY | N = OT NIGHT | H = HOLIDAY
 
  @IsString()
  timeout_from: string;          // "1730" | ""

  @IsString()
  timeout_to: string;            // "1930"

  @IsString()
  update_by: string;             // "JOB" หรือ empno
}