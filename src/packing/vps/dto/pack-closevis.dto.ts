import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PackCloseVISDto {
  @ApiProperty({ 
    description: 'VIS Code',
    example: '8A9580711501'
  })
  @IsString() 
  @IsNotEmpty()
  vis: string;

  @ApiProperty({ 
    description: 'Shipping mark',
    example: '8A9580711501-SM'
  })
  @IsString() 
  @IsNotEmpty()
  shipcode: string;
}
