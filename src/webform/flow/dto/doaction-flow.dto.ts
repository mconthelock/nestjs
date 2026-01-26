import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';
import { FormDto } from 'src/webform/form/dto/form.dto';
export class doactionFlowDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  ACTION: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  EMPNO: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  REMARK?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  CEXTDATA?: string;
}
