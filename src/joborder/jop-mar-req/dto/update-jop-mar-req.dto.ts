import { PartialType } from '@nestjs/swagger';
import { CreateJopMarReqDto } from './create-jop-mar-req.dto';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateJopMarReqDto extends PartialType(CreateJopMarReqDto) {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  JOP_PUR_STATUS: number;

}
