import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateItemMfgDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VITEM_NAME: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NBLOCKID: number;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VPATH: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NSEC_ID: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NTYPE: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NUSERUPDATE: number;
}
