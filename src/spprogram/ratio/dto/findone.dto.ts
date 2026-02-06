import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class findOneDto {
  @IsString()
  @IsNotEmpty()
  TRADER: string;

  @IsString()
  @IsOptional()
  SUPPLIER: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  QUOTATION: number;
}
