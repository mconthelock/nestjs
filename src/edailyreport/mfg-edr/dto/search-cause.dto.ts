import { IsString } from 'class-validator';

export class SearchCauseDto {
  @IsString()
  CAUSE_GROUP: string;
}