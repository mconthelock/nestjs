import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateItemSheetMfgDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NITEMID: number;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VSHEET_NAME: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NUSERCREATE: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NUSERUPDATE: number;
}
