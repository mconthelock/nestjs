import { CreateQainsFormDto } from './create-qains_form.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PickType, PartialType, IntersectionType } from '@nestjs/swagger';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Type } from 'class-transformer';

export class UpdateQainsFormDto extends IntersectionType(
  PartialType(CreateQainsFormDto),
  PickType(FormDto, ['CYEAR2', 'NRUNNO'] as const),
) {
  @IsOptional()
  @IsString()
  QA_TRAINING_DATE?: string;

  @IsOptional()
  @IsString()
  QA_OJT_DATE?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  QA_REV?: number;

  @IsOptional()
  @IsString()
  QA_INCHARGE_EMPNO?: string;
}
