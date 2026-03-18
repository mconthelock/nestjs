import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateLineStatusDto {
  @IsString()
  @IsNotEmpty()
  dispatch_id: string;

  @IsString()
  @IsNotEmpty()
  busid: string;

  @IsString()
  @IsIn(['0', '1'])
  status: '0' | '1';

  @IsString()
  @IsNotEmpty()
  update_by: string;
}