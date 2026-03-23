import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdatePassengerStatusDto {
  @IsString()
  @IsNotEmpty()
  dispatch_id: string;

  @IsString()
  @IsNotEmpty()
  empno: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['E', 'D'])
  status: 'E' | 'D';

  @IsString()
  @IsNotEmpty()
  update_by: string;
}