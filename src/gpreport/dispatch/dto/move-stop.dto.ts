import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class MoveStopDto {
  @IsNotEmpty()
  @IsNumberString()
  dispatch_id: string;

  @IsNotEmpty()
  @IsNumberString()
  stop_id: string;

  @IsNotEmpty()
  @IsNumberString()
  target_line_id: string;

  @IsNotEmpty()
  @IsNumberString()
  stop_name?: string;

  @IsNumberString()
  plan_time?: string;

  @IsNotEmpty()
  @IsString()
  update_by: string;
}