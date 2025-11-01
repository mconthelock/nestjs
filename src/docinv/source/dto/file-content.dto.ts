import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// สำหรับ API /file-content
export class GetFileContentDto {
  @IsString()
  @IsNotEmpty()
  file: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}
