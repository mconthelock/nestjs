import { IsNotEmpty, IsString } from 'class-validator';

export class SearchExpLocalPdmDto {
  @IsNotEmpty()
  @IsString()
  sdate: string;
  
  @IsNotEmpty()
  @IsString()
  edate: string;
}
