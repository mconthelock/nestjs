import { PartialType } from '@nestjs/swagger';
import { CreateMatrixManualDto } from './create-matrix-manual.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMatrixManualDto extends PartialType(CreateMatrixManualDto) {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ID: number;

  @IsNotEmpty()
  @IsString()
  USERUPDATE: string;
}
