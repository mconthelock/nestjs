import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class CreateAppsuserDto {
  @IsString()
  @IsOptional()
  USERS_ID: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  PROGRAM: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  USERS_GROUP: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  USERS_CREATED: Date;

  @IsString()
  @IsOptional()
  USERS_STATUS: string;
}
