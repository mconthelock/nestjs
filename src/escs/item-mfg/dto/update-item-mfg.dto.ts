import { PartialType } from '@nestjs/swagger';
import { CreateItemMfgDto } from './create-item-mfg.dto';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdateItemMfgDto extends PartialType(CreateItemMfgDto) {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  NSTATUS?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  DDATEUPDATE?: Date;
}
