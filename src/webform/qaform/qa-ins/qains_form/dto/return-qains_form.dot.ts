import { PartialType, PickType } from '@nestjs/swagger';
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
export class ReturnQainsFormDto extends PartialType(doactionFlowDto) {

  @IsNotEmpty()
  @IsString()
  QA_ITEM: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  QA_INCHARGE_SECTION: number;

//   @IsNotEmpty()
//   @IsString()
//   QA_INCHARGE_EMPNO: string;

  @IsNotEmpty()
  @Transform(
    ({ value }) => (Array.isArray(value) ? value : [value]), // ถ้าเป็น string เดี่ยว → wrap array
  )
  @IsArray()
  @IsString({ each: true })
  OPERATOR: string[];
}

export class setInchargeQainsFormDto extends PartialType(doactionFlowDto) {
    @IsNotEmpty()
    @IsString()
    QA_INCHARGE_EMPNO: string;
}
