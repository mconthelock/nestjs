import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PackItemRowDto {
  @ApiProperty({ example: 'E8A95807' })
  @IsString()
  ordernoref: string;

  @ApiProperty({ example: '18303 #1' })
  @IsString()
  iteminfo: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  checksta: number;
}

export class PackItemDto {
  @ApiProperty({
    enum: ['success', 'error'],
    description: 'Status of VPS result (success or error)',
  })
  @IsEnum(['success', 'error'])
  status: 'success' | 'error';

  @ApiProperty({ description: 'Result message' })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Flag indicating VIS check completion (true = completed)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  chkcompte?: boolean;

  @ApiProperty({
    description: 'Additional item list',
    type: [PackItemRowDto],
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackItemRowDto)
  items?: PackItemRowDto[] | null;
}
