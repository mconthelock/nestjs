import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateESCSARMDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ARM_SECID: number;
  
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ARM_REV: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ARM_NO: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ARM_SEQ: number;

  @IsNotEmpty()
  @IsString()
  ARM_DETAIL: string;

  @IsNotEmpty()
  @IsString()
  ARM_TYPE: string;
}
