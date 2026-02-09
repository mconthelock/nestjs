import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';
export class CreateAppsgroupDto {
  @IsNumber()
  @Type(() => Number)
  GROUP_ID: number;

  @IsNumber()
  @Type(() => Number)
  PROGRAM: number;

  @IsString()
  GROUP_DESC: string;

  @IsNumber()
  @Type(() => Number)
  GROUP_STATUS: number;

  @IsString()
  @IsOptional()
  GROUP_REMARK?: string;

  @IsString()
  GROUP_CODE: string;

  @IsString()
  @IsOptional()
  GROUP_HOME?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  UPDATE_DATE?: Date;
}
