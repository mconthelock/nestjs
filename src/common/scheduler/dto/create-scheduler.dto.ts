import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Label } from '../../helpers/label.decorator';

export class CreateJobDto {
  @Label('Job Name')
  @IsString()
  @IsNotEmpty()
  NAME: string;

  @Label('API Endpoint URL')
  @IsString()
  @IsNotEmpty()
  URL: string;

  @Label('Parameters (JSON Format)')
  @IsString()
  @IsOptional()
  PARAMETES?: string;

  @Label('Cron Expression')
  @IsString()
  @IsNotEmpty()
  CRON_EXPRESSION: string;

  @Label('Job Detail')
  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  DESCRIPTION?: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  IS_ACTIVE: number;

  @Type(() => Date)
  @IsOptional()
  LAST_RUN_AT?: Date;

  @Label('Job Person In Charge')
  @IsString()
  @IsNotEmpty()
  INCHARGE: string;

  @IsString()
  @IsNotEmpty()
  CREATE_BY: string;
}
