import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';
export class CreateAccesslogDto {
  @IsString()
  @IsNotEmpty()
  loguser!: string;

  @IsString()
  logip: string;

  @Type(() => Number)
  @IsNumber()
  logstatus: number;

  @Type(() => Number)
  @IsNumber()
  logprogram: number;

  @IsString()
  logmsg: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  logdate?: Date;
}
