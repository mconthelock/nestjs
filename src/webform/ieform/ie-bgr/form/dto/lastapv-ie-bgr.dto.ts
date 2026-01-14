import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreatePprbiddingDto } from 'src/amec/pprbidding/dto/create-pprbidding.dto';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';

export class LastApvIeBgrDto extends PickType(doactionFlowDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
  'ACTION',
  'EMPNO',
  'REMARK',
] as const) {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true }) // บอกว่าเป็น array ของ object
  @Type(() => CreatePprbiddingDto)
  pprbidding: CreatePprbiddingDto[];
}
