import { PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { FormDto } from "src/webform/form/dto/form.dto";


export class CreatePurFileDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {
  @IsNotEmpty()
  @IsString()
  FILE_ONAME: string;

  @IsNotEmpty()
  @IsString()
  FILE_FNAME: string;

  @IsNotEmpty()
  @IsString()
  FILE_USERCREATE: string;

  @IsOptional()
  @Type(() => Number)
  FILE_TYPE?: number;

  @IsNotEmpty()
  @IsString()
  FILE_PATH: string;
}