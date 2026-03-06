import { IsIn, IsString } from 'class-validator';

export class DispatchKeyDto {
  @IsString()
  workdate: string; 

  @IsIn(['O', 'W']) // O = OT, W = Workday
  dispatch_type: 'O' | 'W';

  @IsIn(['D', 'N', 'H']) // D = Day, N = Night, H = Holiday
  shift: 'D' | 'N' | 'H';
}