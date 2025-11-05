import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class createDocDto {
  @Type(() => Date)
  @IsOptional()
  LOGDATE: Date;

  @IsString()
  LOGUSER: string;

  @IsString()
  LOGNAME: string;

  @IsString()
  LOGDOC: string;

  @IsString()
  LOGDIR: string;

  @IsString()
  CREATEBY: string;
}
