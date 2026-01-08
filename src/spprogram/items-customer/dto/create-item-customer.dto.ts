import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class createItemCustomerDto {
  @Type(() => Number)
  @IsNumber()
  CUSTOMER_ID: number;

  @Type(() => Number)
  @IsNumber()
  ITEMS_ID: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  CREATE_AT: Date;

  @IsString()
  CREATE_BY: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  UPDATE_AT: Date;

  @IsString()
  @IsOptional()
  UPDATE_BY: string;
}
