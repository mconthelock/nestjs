import { PartialType } from '@nestjs/swagger';
import { CreateChemicalSectionDto } from './create-chemical-section.dto';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateChemicalSectionDto extends PartialType(
  CreateChemicalSectionDto,
) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  STATUS?: number;

  @IsOptional()
  @IsString()
  USER_UPDATE?: string;
}
