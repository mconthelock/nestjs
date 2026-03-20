import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveDispatchDto {
  @IsNumber()
  dispatch_id: number;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  update_by?: string;
}