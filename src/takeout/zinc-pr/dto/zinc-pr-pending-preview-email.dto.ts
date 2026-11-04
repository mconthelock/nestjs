import { ArrayNotEmpty, IsArray, IsEmail } from 'class-validator';

export class ZincPrPendingPreviewEmailDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  to: string[];
}