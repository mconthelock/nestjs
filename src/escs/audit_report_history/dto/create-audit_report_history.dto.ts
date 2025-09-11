import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateESCSARHDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ARH_SECID: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ARH_REV: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ARH_NO: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ARH_SEQ: number;

  @IsNotEmpty()
  @IsString()
  ARH_DETAIL: string;

  @IsNotEmpty()
  @IsString()
  ARH_TYPE: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ARH_STATUS: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ARH_FACTOR?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ARH_MAXSCORE?: number;
}
