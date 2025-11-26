import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PackVISDto {
  @ApiProperty({ example: '07C128A95807', description: 'VIS Code' })
  @IsNotEmpty()
  @IsString()
  vis: string;
}
