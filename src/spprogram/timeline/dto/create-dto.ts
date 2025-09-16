import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class createTimelineDto {
  @IsString()
  INQ_NO: string;

  @IsString()
  INQ_REV: string;

  @IsString()
  MAR_USER: string;

  @IsDate()
  @Type(() => Date)
  MAR_SEND: Date;
}
