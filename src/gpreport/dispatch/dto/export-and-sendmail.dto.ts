import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ExportAndSendMailDto {
  @IsNumber()
  dispatch_id: number;

  @IsString()
  @IsNotEmpty()
  workdate: string;

  @IsString()
  @IsNotEmpty()
  dispatch_type: string;

  @IsString()
  @IsNotEmpty()
  update_by: string;

  @IsOptional()
  @IsString()
  mail_to?: string;

  @IsOptional()
  @IsString()
  mail_cc?: string;

  @IsOptional()
  @IsString()
  mail_bcc?: string;

  @IsOptional()
  @IsString()
  display_date_text?: string;

  @IsOptional()
  @IsString()
  display_time_text?: string;
}