import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class searchDto {
  @ApiPropertyOptional({ example: '24008' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  SEMPNO: string;

  @ApiPropertyOptional({ example: '050604' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  SSECCODE: string;

  @ApiPropertyOptional({ example: '050601' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  SDEPCODE: string;

  @ApiPropertyOptional({ example: '050101' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  SDIVCODE: string;

  @ApiPropertyOptional({ example: '40' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  SPOSCODE: string;

  @ApiPropertyOptional({ example: '1' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  CSTATUS: string;

  @ApiPropertyOptional({ example: '542A24028F7E1EFF6BE2BBC9A257FCE1' })
  @IsOptional()
  @IsString()
  SEMPENCODE: string;
}
