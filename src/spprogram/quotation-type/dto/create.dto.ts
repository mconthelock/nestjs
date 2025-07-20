import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class createDto {
  @IsString()
  @IsNotEmpty()
  QUOTYPE_DESC: string;

  @Type(() => Number)
  @IsNumber()
  QUOTYPE_STATUS: number;

  @IsString()
  QUOTYPE_CUR?: string;
}
