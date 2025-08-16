import { PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateOrderdummyDto } from './create-orderdummy.dto';

export class SearchOrderdummyDto extends PartialType(CreateOrderdummyDto) {
  @IsOptional()
  @IsString()
  SMFGNO?: string;
}
