import { IsOptional, IsString, IsNumber, IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';
import { FormDto } from './form.dto';

export class getModeDto extends PickType(FormDto, [
  'NFRMNO', 'VORGNO', 'CYEAR', 'CYEAR2', 'NRUNNO',
] as const) {
  @IsNotEmpty()
  @IsString()
  readonly EMPNO: string;
}
