import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDate,
} from 'class-validator';
export class CreateAppsgroupDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  GROUP_ID: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  PROGRAM: number;

  @IsString()
  @IsOptional()
  GROUP_DESC: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  GROUP_STATUS: number;

  @IsString()
  @IsOptional()
  GROUP_REMARK: string;

  @IsString()
  @IsOptional()
  GROUP_CODE: string;

  @IsString()
  @IsOptional()
  GROUP_HOME: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  UPDATE_DATE: Date;
}
