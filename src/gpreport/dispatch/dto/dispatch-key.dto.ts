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

  @IsIn(['D', 'S' , 'N', 'H']) // D=Day(19.30), S=Special (21.30),  N=Night (07.30), H=Holiday (17.00)
  shift: 'D' | 'S' | 'N' | 'H';
}