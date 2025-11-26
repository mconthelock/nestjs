import { ApiProperty } from '@nestjs/swagger';

export class PackItemRowDto {
  @ApiProperty({ example: 'E8A95807' })
  ordernoref: string;

  @ApiProperty({ example: '18303 #1' })
  iteminfo: string;

  @ApiProperty({ example: 0 })
  checksta: number;
}

export class PackItemDto {
  @ApiProperty({ 
    enum: ['success', 'error'], 
    description: 'Status of VPS result (success or error)' 
  })
  status: 'success' | 'error';

  @ApiProperty({ description: 'Result message' })
  message: string;

  @ApiProperty({ 
    description: 'Flag indicating VIS check completion (true = completed)', 
    example: true, 
    required: false 
  })
  chkcompte?: boolean;

 @ApiProperty({
    description: 'Additional item list',
    type: [PackItemRowDto],
    required: false,
    nullable: true,
    example: [
      { ordernoref: 'E8A95807', iteminfo: '18303 #1', checksta: 0 },
      { ordernoref: 'E8A95807', iteminfo: '18303 #2', checksta: 0 },
      { ordernoref: 'E8A95807', iteminfo: '18303 #3', checksta: 1 },
    ],
  })
  items?: PackItemRowDto[] | null;
}
