import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ESCSCreateUserFileDto {
  @IsNotEmpty()
  @IsString()
  UF_ITEM: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  UF_STATION: number;

  @IsNotEmpty()
  @IsString()
  UF_USR_NO: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  UF_ID?: number;

  @IsNotEmpty()
  @IsString()
  UF_ONAME: string;

  @IsNotEmpty()
  @IsString()
  UF_FNAME: string;

  @IsOptional()
  @IsString()
  UF_PATH?: string;
}
