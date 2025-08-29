import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateESCSARMDto } from './create-audit_report_master.dto';
import { Type } from 'class-transformer';

export class SearchESCSARMDto extends IntersectionType(
  PartialType(CreateESCSARMDto),
  PickType(CreateESCSARMDto, ['ARM_REV', 'ARM_NO', 'ARM_SEQ', 'ARM_TYPE']),
) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ARM_STATUS: number;
}
