import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateESCSARRDto } from './create-audit_report_revision.dto';
import { Type } from 'class-transformer';

export class SearchESCSARRDto extends PartialType(CreateESCSARRDto) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ARR_REV?: number;

  @IsOptional()
  @IsString()
  ARR_REV_TEXT?: string;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  readonly orderbyDirection?: 'ASC' | 'DESC';
}
