import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBlockMasterDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VNAME: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VCODE: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NUSERUPDATE: number;
}
