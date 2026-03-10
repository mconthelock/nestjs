import { IsString, IsIn } from 'class-validator';

export class BuildDailyFirstDto {
  @IsString()
  timeout_from: string;

  @IsString()
  timeout_to: string;

  @IsString()
  update_by: string;

  @IsString()
  workdate: string; 
  
  @IsIn(['O', 'W']) // O = OT, W = Workday
  dispatch_type: 'O' | 'W';
  
  @IsIn(['D', 'N', 'H']) // D = Day, N = Night, H = Holiday
  shift: 'D' | 'N' | 'H';
}