import { PartialType } from '@nestjs/swagger';
import { CreateItemSheetMfgDto } from './create-item-sheet-mfg.dto';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdateItemSheetMfgDto extends PartialType(CreateItemSheetMfgDto) {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  NSTATUS?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  DDATEUPDATE?: Date;
}
