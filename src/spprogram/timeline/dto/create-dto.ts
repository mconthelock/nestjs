import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class createTimelineDto {
  @IsString()
  INQ_NO: string;

  @IsString()
  INQ_REV: string;

  @IsString()
  MAR_USER: string;

  @IsDate()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  })
  MAR_SEND: Date;
}
