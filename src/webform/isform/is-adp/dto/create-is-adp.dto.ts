import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateIsAdpDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
] as const) {
  @IsNotEmpty()
  @IsString()
  REQUESTER: string;

  @IsNotEmpty()
  @IsString()
  CREATEBY: string;

  @IsOptional()
  @IsString()
  REMARK?: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true }) // บอกว่าเป็น array ของ object
  @Type(() => insertIsAdpDto) // ต้องแปลงเป็น AttachmentDto
  data: insertIsAdpDto[];
}

export class insertIsAdpDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  PLANYEAR: number;

  @IsNotEmpty()
  @IsString()
  REQ_DIV: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  USER_REQ: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  DEV_PLAN: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  MANHOUR: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  COST: number;
}
