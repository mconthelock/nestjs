import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFxaLocmstDto {
  @IsNotEmpty()
  @IsString()
  LOCCODE: string;

  @IsNotEmpty()
  @IsString()
  LOCNAME: string;
  
  @IsNotEmpty()
  @IsString()
  VORGNO: string;

  @IsNotEmpty()
  @IsString()
  SPOSCODE: string;

}

