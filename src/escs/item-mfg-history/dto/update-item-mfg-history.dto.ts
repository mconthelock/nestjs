import { PartialType } from '@nestjs/swagger';
import { CreateItemMfgHistoryDto } from './create-item-mfg-history.dto';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdateItemMfgHistoryDto extends PartialType(
  CreateItemMfgHistoryDto,
) {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  NSTATUS?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  DDATEUPDATE?: Date;
}
