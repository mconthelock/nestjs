import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateQainsAuditDto  extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  QAA_AUDIT_SEQ: number;

  @IsNotEmpty()
  @IsString()
  QAA_TYPECODE: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  QAA_TOPIC: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  QAA_SEQ: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  QAA_AUDIT: number;

  @IsOptional()
  @IsString()
  QAA_COMMENT?: string;
}

export class saveQainsAuditDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQainsAuditDto)
  data: CreateQainsAuditDto[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  draft?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  res?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  auditSeq: number;

  @IsNotEmpty()
  @IsString()
  typecode: string;
}
