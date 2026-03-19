import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLineTypeDto {
  @Type(() => Number)
  @IsNumber()
  dispatch_id: number;

  @Type(() => Number)
  @IsNumber()
  busid: number;

  @IsString()
  bustype: string;

  @Type(() => Number)
  @IsNumber()
  busseat: number;

  @IsString()
  update_by: string;
}