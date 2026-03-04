import { PartialType } from '@nestjs/swagger';
import { CreateItemMasterAuthorizeDto } from './create-item-master-authorize.dto';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdateItemMasterAuthorizeDto extends PartialType(
  CreateItemMasterAuthorizeDto,
) {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  NSTATUS?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  DDATECREATE?: Date;
}
