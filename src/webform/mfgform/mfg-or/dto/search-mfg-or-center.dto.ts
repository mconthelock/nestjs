// dto/search-mfg-or-center.dto.ts
import { IsString } from 'class-validator';

export class SearchMfgOrCenterDto {
  @IsString()
  ORNO: string;
}