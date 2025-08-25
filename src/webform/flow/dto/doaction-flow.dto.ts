import { IsOptional, IsString, IsNumber, IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';
import { FormDto } from 'src/webform/form/dto/form.dto';
export class doactionFlowDto extends PickType(FormDto, [
  'NFRMNO', 'VORGNO', 'CYEAR', 'CYEAR2', 'NRUNNO',
] as const) {
  @IsNotEmpty()
  @IsString()
  ACTION?: string;

  @IsNotEmpty()
  @IsString()
  EMPNO: string;

  @IsOptional()
  @IsString()
  REMARK?: string;

}
