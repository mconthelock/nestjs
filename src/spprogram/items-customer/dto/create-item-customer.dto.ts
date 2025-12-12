import { Type } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

export class createItemCustomerDto {
  @Type(() => Number)
  @IsNumber()
  CUSTOMER_ID: number;

  @Type(() => Number)
  @IsNumber()
  ITEMS_ID: number;

  @IsString()
  CREATE_AT: string;

  @IsString()
  CREATE_BY: string;

  @IsString()
  UPDATE_AT: string;

  @IsString()
  UPDATE_BY: string;
}
