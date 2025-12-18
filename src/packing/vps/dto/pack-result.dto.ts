import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum PackStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export class PackItemRowDto {
  @ApiProperty({ 
    example: 'E8A95807' 
  })
  ordernoref: string;

  @ApiProperty({ 
    example: '18303 #1' 
  })
  iteminfo: string;

  @ApiProperty({ 
    example: 0 
  })
  checksta: boolean;

  @ApiProperty({
    description: 'VPS Code',
    example: '8A95807183031',
  })
  vps: string;
}

export class PackResultDto {
  @ApiProperty({
    description: 'Status of VPS result',
    enum: PackStatus,
  })
  status: PackStatus;

  @ApiProperty({
    description: 'Result message',
  })
  message: string;

  @ApiProperty({
    description: 'Flag indicating VIS check completion (true = completed)',
    example: true,
    required: false,
  })
  chkcompte?: boolean;

  @ApiProperty({
    description: 'Additional item list',
    type: [PackItemRowDto],
    required: false,
  })
  items?: PackItemRowDto[];
}
