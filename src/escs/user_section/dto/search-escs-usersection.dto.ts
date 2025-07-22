import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchEscsUserSectionDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly SEC_ID?: number;

  @ApiProperty({ required: false, example: 'QC1' })
  @IsOptional()
  @IsString()
  readonly SEC_NAME?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number) 
  @IsNumber()
  readonly SEC_STATUS?: number;

  @ApiProperty({ required: false, example: '04014' })
  @IsOptional()
  @IsString()
  readonly INCHARGE?: string;
}
