import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetOrInitDto {
  @IsString()
  dispatch_date: string;

  @IsString()
  dispatch_type: string;

  @IsString()
  shift: string;
  
  @IsString()
  update_by: string;
}