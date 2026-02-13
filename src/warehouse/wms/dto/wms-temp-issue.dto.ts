import { ApiProperty } from '@nestjs/swagger';

export class WMSTempIssueDto {
  @ApiProperty({
    example: '6020618044',
  })
  ISSUE: string;

  @ApiProperty({
    example: '-',
  })
  STATUS: string;

  @ApiProperty({
    example: 'Q19292',
  })
  ITEMCODE: string;

  @ApiProperty({
    example: 'RING',
  })
  DESCRIPTION: string;

  @ApiProperty({
    example: '2026026',
    description: 'Production batch number',
  })
  PROD: string;

  @ApiProperty({
    example: 'AB03404',
  })
  LOCATION: string;

  @ApiProperty({
    example: 1,
    description: 'Quantity',
  })
  QTY: number;

  @ApiProperty({
    example: 'B2AS2',
  })
  ISSUETO: string;

  @ApiProperty({
    example: '58240168',
  })
  PO: string;

  @ApiProperty({
    example: '1',
  })
  LINE: string;

  @ApiProperty({
    example: 'AM-6879',
  })
  INV: string;

  @ApiProperty({
    example: '250088494',
  })
  PALLET_ID: string;

  @ApiProperty({
    example: '-',
  })
  EXPIRE_DATE: string;
}
