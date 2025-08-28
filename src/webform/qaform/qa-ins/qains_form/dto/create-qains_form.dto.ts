import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';
export class CreateQainsFormDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
] as const) {
  @IsNotEmpty()
  @IsString()
  REQUESTER: string;

  @IsNotEmpty()
  @IsString()
  CREATEBY: string;

  @IsOptional()
  @IsString()
  REMARK?: string;

  @IsNotEmpty()
  @IsString()
  QA_ITEM: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  QA_INCHARGE_SECTION: number;

  @IsNotEmpty()
  @IsString()
  QA_INCHARGE_EMPNO: string;

  @IsNotEmpty()
  @Transform(
    ({ value }) => (Array.isArray(value) ? value : [value]), // ถ้าเป็น string เดี่ยว → wrap array
  )
  @IsArray()
  @IsString({ each: true })
  OPERATOR: string[];
}
