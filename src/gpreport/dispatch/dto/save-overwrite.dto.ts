import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveOverwriteDto {
  @IsNumber()
  dispatch_id: number;

  @IsString()
  update_by: string;
}

