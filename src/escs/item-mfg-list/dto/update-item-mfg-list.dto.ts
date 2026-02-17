import { PartialType } from '@nestjs/swagger';
import { CreateItemMfgListDto } from './create-item-mfg-list.dto';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdateItemMfgListDto extends PartialType(CreateItemMfgListDto) {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  NSTATUS?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  DDATEUPDATE?: Date;
}
