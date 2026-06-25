import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateFxaLocmstDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.toString())
  LOCCODE: string;

  @IsNotEmpty()
  @IsString()
  LOCNAME: string;
  
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.toString())
  VORGNO: string;

  @IsNotEmpty()
  @IsString()
  SPOSCODE: string;

}

