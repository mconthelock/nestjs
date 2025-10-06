import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ESCSCreateUserItemDto {
  @IsNotEmpty()
  @IsString()
  USR_NO: string;

  @IsNotEmpty()
  @IsString()
  IT_NO: string;

  @IsOptional()
  @IsString()
  UI_FFILE?: string;

  @IsOptional()
  @IsString()
  UI_OFILE?: string;

  @IsOptional()
  @IsString()
  UI_USERUPDATE?: string;
}
