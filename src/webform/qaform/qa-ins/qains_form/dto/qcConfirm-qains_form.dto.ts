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
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
    
export class QcConfQainsFormDto extends PickType(doactionFlowDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
  'REMARK',
  'ACTION',
  'EMPNO'
] as const) {

  @IsNotEmpty()
  @IsString()
  TRAINING_DATE: string;

  @IsNotEmpty()
  @IsString()
  OJTDATE: string;
  
  @IsNotEmpty()
  @IsString()
  QCFOREMAN: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  QA_REV: number;

  @IsNotEmpty()
  @Transform(({ value }) => 
    Array.isArray(value) ? value : [value] // ถ้าเป็น string เดี่ยว → wrap array
  )
  @IsArray()
  @IsString({ each: true })
  AUDITOR: string[];
}
