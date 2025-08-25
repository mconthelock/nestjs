import { IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AttachmentDto {
  @IsString()
  filename: string;

  // content อาจจะเป็น base64 string หรือ path → เอาเป็น string ไปก่อน
  @IsString()
  content: string;
}