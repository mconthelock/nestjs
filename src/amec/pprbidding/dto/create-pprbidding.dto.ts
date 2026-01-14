import { IsNotEmpty, IsString } from "class-validator";

export class CreatePprbiddingDto {
  @IsNotEmpty()
  @IsString()
  SPRNO: string;

  @IsNotEmpty()
  @IsString()
  BIDDINGNO: string;
  
  @IsNotEmpty()
  @IsString()
  EBUDGETNO: string;
}
