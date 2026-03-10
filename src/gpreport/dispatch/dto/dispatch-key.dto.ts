import { Transform, Type } from 'class-transformer';
import { IsDate, IsIn } from 'class-validator';

export class DispatchKeyDto {
  @Type(() => Date)
  @Transform(({ value }) => {
    if (!value) return null;
    const d = new Date(value);
    d.setHours(0, 0, 0, 0);
    return d;
  })
  @IsDate()
  workdate: Date; 

  @IsIn(['O', 'W']) // O = OT, W = Workday
  dispatch_type: 'O' | 'W';

  @IsIn(['D', 'N', 'H']) // D = Day, N = Night, H = Holiday
  shift: 'D' | 'N' | 'H';
}