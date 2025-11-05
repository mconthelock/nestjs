import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class createSchdDto {
  @Type(() => Date)
  @IsDate()
  PLANDATE: Date;

  @IsString()
  TASKNAME: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  STARTDATE: Date;

  @Type(() => Date)
  @IsString()
  @IsDate()
  @IsOptional()
  FINISHDATE: Date;

  @Type(() => Number)
  @IsNumber()
  STATUS: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  CREATEAT: Date;

  @Column()
  @IsString()
  @IsOptional()
  CREATEBY: string;

  @Column()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  UPDATEAT: Date;

  @Column()
  @IsString()
  @IsOptional()
  UPDATEBY: string;
}
