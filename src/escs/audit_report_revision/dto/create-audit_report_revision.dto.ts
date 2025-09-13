import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateESCSARRDto {
//   @IsNotEmpty()
//   @Type(() => Number)
//   @IsNumber()
//   ARR_REV: number;

//   @IsNotEmpty()
//   @IsString()
//   ARR_REV_TEXT: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ARR_SECID: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ARR_INCHARGE: number;

  @IsNotEmpty()
  @IsString()
  ARR_REASON: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ARR_TOTAL: number;
}
