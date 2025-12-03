import { IsNotEmpty, IsString } from 'class-validator';

export class ExcelHbdDto {
  @IsNotEmpty()
  @IsString()
  month: string;

  @IsNotEmpty()
  @IsString()
  year: string;

  @IsNotEmpty()
  @IsString()
  empno: string;
}
