import { IsOptional, IsString } from 'class-validator';

export class SearchSequenceOrgDto {
  @IsOptional()
  @IsString()
  EMPNO?: string;

  @IsOptional()
  @IsString()
  SPOSCODE?: string;

  @IsOptional()
  @IsString()
  CCO?: string;

  @IsOptional()
  @IsString()
  HEADNO?: string;

  @IsOptional()
  @IsString()
  SPOSCODE1?: string;

  @IsOptional()
  @IsString()
  CCO1?: string;

  @IsOptional()
  @IsString()
  VORGNO?: string;

  @IsOptional()
  @IsString()
  VORGNO1?: string;
}
