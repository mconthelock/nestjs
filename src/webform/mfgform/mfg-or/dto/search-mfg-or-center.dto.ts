// dto/search-mfg-or-center.dto.ts

import { IsOptional, IsString } from 'class-validator';

export class SearchMfgOrCenterDto {

  @IsOptional()
  @IsString()
  ORNO?: string;

  @IsOptional()
  @IsString()
  TOPIC?: string;

  @IsOptional()
  @IsString()
  CLASS?: string;

  @IsOptional()
  @IsString()
  CYEAR?: string;

  @IsOptional()
  @IsString()
  FORMNO?: string;
}