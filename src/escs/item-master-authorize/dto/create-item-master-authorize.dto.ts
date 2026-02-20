import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateItemMasterAuthorizeDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VAUTH: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NTYPE: number;
}
