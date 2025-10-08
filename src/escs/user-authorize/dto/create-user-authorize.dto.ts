import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ESCSCreateUserAuthorizeDto {
  @IsNotEmpty()
  @IsString()
  UA_ITEM: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  UA_STATION: number;

  @IsNotEmpty()
  @IsString()
  UA_USR_NO: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  UA_SCORE: number;

  @IsNotEmpty()
  @IsString()
  UA_GRADE: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  UA_TOTAL: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  UA_PERCENT: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  UA_REV: number;

  @IsNotEmpty()
  @IsString()
  UA_TEST_BY: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  UA_TEST_DATE: Date;
}
