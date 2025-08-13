import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
export class CreateQainsFormDto {
  //   @IsOptional()
  @Type(() => Number)
  @IsNumber()
  NFRMNO: number;

  //   @IsOptional()
  @IsString()
  VORGNO: string;

  //   @IsOptional()
  @IsString()
  CYEAR: string;

  @IsString()
  REQUESTER: string;

  @IsString()
  CREATEBY: string;

  @IsOptional()
  @IsString()
  QA_ITEM?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  QA_INCHARGE_SECTION?: number;

  @IsOptional()
  @IsString()
  QA_INCHARGE_EMPNO?: string;

  @IsOptional()
  @IsString()
  QA_TRAINING_DATE?: string;

  @IsOptional()
  @IsString()
  QA_OJT_DATE?: string;
}
