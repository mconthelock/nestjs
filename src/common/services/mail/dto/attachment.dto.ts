import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AttachmentDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  // content อาจจะเป็น base64 string หรือ path → เอาเป็น string ไปก่อน
  @IsOptional()
//   @IsString()
  content: string | Buffer;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  cid?: string;


  @IsOptional()
  @IsString()
  encoding?: string;
}
