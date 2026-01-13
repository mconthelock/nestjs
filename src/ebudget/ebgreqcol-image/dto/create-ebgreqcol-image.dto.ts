import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateEbgreqcolImageDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  COLNO: number;

  @IsNotEmpty()
  @IsString()
  ID: string;

  @IsNotEmpty()
  @IsString()
  IMAGE_FILE: string;

  @IsNotEmpty()
  @IsString()
  SFILE: string;
}
