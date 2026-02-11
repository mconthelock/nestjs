import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePprbiddingDto {
  @IsNotEmpty()
  @IsString()
  SPRNO: string;

  @IsOptional()
  @IsString()
  BIDDINGNO: string | null;
  
  @IsNotEmpty()
  @IsString()
  EBUDGETNO: string;
}
