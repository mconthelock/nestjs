import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
export class UpsertSetRequestDateDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  JOP_PONO: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  JOP_LINENO: number;

  @IsOptional()
  @IsString()
  JOP_PUR_STATUS: string;

  @IsOptional()
  @IsString()
  JOP_REQUESTDATE: string;

  //   @IsOptional()
  //   @IsString()
  //   JOP_USERCREATE: string;

  //   @IsOptional()
  //   @IsDateString()
  //   JOP_CREATEDATE: string;

  //   @IsOptional()
  //   @IsString()
  //   JOP_USERUPDATE: string;

  //   @IsOptional()
  //   @IsDateString()
  //   JOP_UPDATEDATE: string;

  @IsOptional()
  @IsString()
  ACTION_BY: string;

  @IsOptional()
  @IsString()
  ACTION_DATE: string;
}
