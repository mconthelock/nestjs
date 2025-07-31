import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchFlowDto {
  @ApiProperty({ example: 6 })
  //   @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly NFRMNO: number;

  @ApiProperty({ example: '050601' })
  //   @IsOptional()
  @IsString()
  readonly VORGNO: string;

  @ApiProperty({ example: '25' })
  //   @IsOptional()
  @IsString()
  readonly CYEAR: string;

  @ApiProperty({ example: '2025' })
  //   @IsOptional()
  @IsString()
  readonly CYEAR2: string;

  @ApiProperty({ example: 10 })
  //   @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly NRUNNO: number;

  @ApiProperty({ example: '08375' })
  @IsOptional()
  @IsString()
  readonly VAPVNO?: string;

  @ApiProperty({ example: '06' })
  @IsOptional()
  @IsString()
  readonly CSTEPNO?: string;

  @ApiProperty({ example: '06' })
  @IsOptional()
  @IsString()
  readonly CSTEPNEXTNO?: string;

  @ApiProperty({ example: '1' })
  @IsOptional()
  @IsString()
  readonly CSTART?: string;

  @ApiProperty({ example: '3' })
  @IsOptional()
  @IsString()
  readonly CSTEPST?: string;
}
