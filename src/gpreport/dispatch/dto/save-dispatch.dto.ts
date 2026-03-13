import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveDispatchDto {
  @IsNumber()
  dispatch_id: number;

  @IsOptional()
  @IsString()
  update_by?: string;

  @IsArray()
  lines: any[]; 
}