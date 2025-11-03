import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class searchTasklogs {
  @IsString()
  @IsOptional()
  readonly query?: string;

  @IsString()
  @IsOptional()
  readonly server?: string;

  @Type(() => Date)
  @IsOptional()
  readonly startDate?: Date;

  @Type(() => Date)
  @IsOptional()
  readonly endDate?: Date;

  @IsString()
  @IsOptional()
  readonly users?: string;

  @IsString()
  @IsOptional()
  readonly status?: string;
}
