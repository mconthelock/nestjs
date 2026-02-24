import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateControlDrawingPisDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NITEMID: number;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VDRAWING: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  VREMARK?: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NUSERUPDATE: number;
}
