import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttachmentDto } from './attachment.dto';

export class SendMailDto {
  @IsOptional()
  @IsString()
  host?: string;

  @IsOptional()
  port?: string | number;

  @IsOptional()
  @IsString()
  from?: string;
    
  @IsOptional()
  to?: string | string[];

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  cc?: string | string[];

  @IsOptional()
  bcc?: string | string[];

 @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })   // บอกว่าเป็น array ของ object
  @Type(() => AttachmentDto)        // ต้องแปลงเป็น AttachmentDto
  attachments?: AttachmentDto[];
}
