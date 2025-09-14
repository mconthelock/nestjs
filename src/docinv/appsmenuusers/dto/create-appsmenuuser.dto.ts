import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
export class CreateAppsmenuuserDto {
  @IsNumber()
  @Type(() => Number)
  MENU_ID: number;

  @IsNumber()
  @Type(() => Number)
  USERS_GROUP: number;

  @IsNumber()
  @Type(() => Number)
  PROGRAM: number;
}
