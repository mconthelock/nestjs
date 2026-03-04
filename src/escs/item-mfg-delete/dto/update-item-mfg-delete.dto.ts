import { PartialType } from '@nestjs/swagger';
import { CreateItemMfgDeleteDto } from './create-item-mfg-delete.dto';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdateItemMfgDeleteDto extends PartialType(
  CreateItemMfgDeleteDto,
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
