import { PartialType } from '@nestjs/swagger';
import { CreateControlDrawingPisDto } from './create-control-drawing-pis.dto';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdateControlDrawingPisDto extends PartialType(
  CreateControlDrawingPisDto,
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
