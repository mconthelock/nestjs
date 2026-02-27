import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemMfgListDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NITEMID: number;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VDRAWING: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NSHEETID: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  VNUMBER_FILE?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  VREMARK?: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NUSERCREATE: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NUSERUPDATE: number;
}
