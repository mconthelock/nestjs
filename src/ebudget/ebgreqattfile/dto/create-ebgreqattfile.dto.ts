import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateEbgreqattfileDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  TYPENO: number;

  @IsNotEmpty()
  @IsString()
  ID: string;

  @IsNotEmpty()
  @IsString()
  SFILE: string;

  @IsNotEmpty()
  @IsString()
  OFILE: string;
}
