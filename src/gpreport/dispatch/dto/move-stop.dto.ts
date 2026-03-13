import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class MoveStopDto {
  @IsNotEmpty()
  @IsString()
  dispatch_id: string;

  @IsNotEmpty()
  @IsString()
  stop_id: string;

  @IsOptional()
  @IsString()
  target_line_id?: string;

  @IsOptional()
  @IsString()
  stop_name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}$/, { message: 'plan_time must be HHMM' })
  plan_time?: string;

  @IsNotEmpty()
  @IsString()
  update_by: string;
}