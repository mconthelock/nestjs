import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsNumberString()
  plan_time?: string;

  @IsNotEmpty()
  @IsString()
  update_by: string;
}