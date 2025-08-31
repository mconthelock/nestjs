import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber } from 'class-validator';
export class CreateAppsmenuDto {
  @IsString()
  @IsOptional()
  MENU_DISPLAY: string;

  @IsString()
  @IsOptional()
  MENU_CLASS: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  MENU_TYPE: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  MENU_TOP: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  MENU_SEQ: number;

  @IsString()
  @IsOptional()
  MENU_LINK: string;

  @IsString()
  @IsOptional()
  MENU_REMARK: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  MENU_PROGRAM: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  MENU_NO: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  MENU_STATUS: number;

  @IsString()
  @IsOptional()
  MENU_TNAME: string;

  @IsString()
  @IsOptional()
  MENU_ICON: string;
}
