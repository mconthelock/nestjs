import { IsNumber, IsString } from 'class-validator';

export class UpdateStatusDispatchDto {
  @IsNumber()
  dispatch_id: number;

  @IsString()
  status: string;
}

