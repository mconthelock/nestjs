import { PartialType } from '@nestjs/swagger';
import { CreateEbudgetQuotationDto } from './create-ebudget-quotation.dto';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEbudgetQuotationDto extends PartialType(
  CreateEbudgetQuotationDto,
) {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ID?: number;

  @IsOptional()
  @IsString()
  UPDATE_BY?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  DATE_UPDATE?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  STATUS?: number;
}
