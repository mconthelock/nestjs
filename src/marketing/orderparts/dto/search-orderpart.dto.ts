import { PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateOrderpartDto } from './create-orderpart.dto';

export class SearchOrderpartDto extends PartialType(CreateOrderpartDto) {
  @IsOptional()
  @IsString()
  SMFGNO?: string;
}
