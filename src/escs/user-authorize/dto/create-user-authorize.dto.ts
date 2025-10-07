import { IsNotEmpty } from 'class-validator';

export class ESCSCreateUserAuthorizeDto {
  @IsNotEmpty()
  UA_ITEM: string;

  @IsNotEmpty()
  UA_STATION: number;

  @IsNotEmpty()
  UA_USR_NO: string;

  @IsNotEmpty()
  UA_SCORE: number;

  @IsNotEmpty()
  UA_GRADE: string;

  @IsNotEmpty()
  UA_TOTAL: number;
  
  @IsNotEmpty()
  UA_PERCENT: number;

  @IsNotEmpty()
  UA_REV: number;
}
