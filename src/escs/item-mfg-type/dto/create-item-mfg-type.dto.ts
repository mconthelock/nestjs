import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateItemMfgTypeDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NTYPE: number;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VDESCRIPTION: string;
}
