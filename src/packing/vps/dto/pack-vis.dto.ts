import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PackVISDto {
  @ApiProperty({ example: '07C128A95807', description: 'VIS Code' })
  @IsString() 
  @IsNotEmpty()
  vis: string;
}
