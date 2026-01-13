import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateEbudgetQuotationDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {
  @IsNotEmpty()
  @IsString()
  QTA_FORM: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  QTA_VALID_DATE?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TOTAL: number;

  @IsNotEmpty()
  @IsString()
  CREATE_BY: string;
}
