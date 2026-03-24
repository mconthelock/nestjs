import { Transform, Type } from 'class-transformer';
import { IsString, IsIn, IsDate } from 'class-validator';
import { DispatchKeyDto } from './dispatch-key.dto';

export class BuildDailyFirstDto extends DispatchKeyDto {
  @IsString()
  timeout_from: string;

  @IsString()
  timeout_to: string;

  @IsString()
  update_by: string;
}