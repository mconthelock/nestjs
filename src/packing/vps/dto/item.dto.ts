import { ApiProperty } from '@nestjs/swagger';

export class ItemDto {
  @ApiProperty({ description: 'Result code', example: '0' })
  code: string;

  @ApiProperty({ description: 'Result message', example: 'Success' })
  message: string;

  @ApiProperty({ description: 'Additional data 1', example: 'SomeData', required: false })
  data1?: string;

  @ApiProperty({ description: 'Additional data 2', example: 'SomeData2', required: false })
  data2?: string;
}
