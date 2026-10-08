import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsInt } from 'class-validator';

export class CreatePurTrackingDto {
  //หมายเลข PO
  @IsNumber()
  @IsPositive({ message: "PORD must be a positive number greater than 0" }) // ป้องกันค่า 0 และค่าติดลบ
  @IsInt({ message: "PORD must be an integer number" }) // บังคับให้เป็นจำนวนเต็ม และดักจับกรณีที่แปลงค่าแล้วได้ NaN
  @IsNotEmpty({ message: "PORD is required" })
  @Type(() => Number)
  PONO: number;

  @IsString({ message: "PPROD must be a string" })
  @IsNotEmpty({ message: "PPROD is required" })
  PPROD: string; //item code

  @IsNumber()
  @IsNotEmpty({ message: "PLINE is required" })
  @IsPositive({ message: "PLINE must be a positive number greater than 0" }) // ป้องกันค่า 0 และค่าติดลบ
  @IsInt({ message: "PLINE must be an integer number" }) // บังคับให้เป็นจำนวนเต็ม และดักจับกรณีที่แปลงค่าแล้วได้ NaN
  @Type(() => Number)
  PLINE: number;  //PLINE

  @IsNumber()
  @IsNotEmpty({ message: "PORD is required" })
  @IsPositive({ message: "PORD must be a positive number greater than 0" }) // ป้องกันค่า 0 และค่าติดลบ
  @IsInt({ message: "PORD must be an integer number" }) // บังคับให้เป็นจำนวนเต็ม และดักจับกรณีที่แปลงค่าแล้วได้ NaN
  @Type(() => Number)
  PORD: number;  //PORD

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ETD?: Date;  //ETD
  
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ETA?: Date; //ETA

  @IsOptional()
  @IsString()
  SHIP_MODE?: string; //ship mode

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ARV_AMEC?: Date; //ARV_AMEC

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ARV_QTY?: number;

  @IsOptional()
  @IsString()
  INV_NO?: string;

  @IsOptional()
  @IsString()
  COMMENT_PUR?: string;
  
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  NEXT_REPLY?: Date; //NEXT_REPLY

  @IsOptional()
  @IsString()
  CAUSE_OF?: string; //CAUSE_OF

  @IsString()
  @IsOptional()
  REMARK?: string; //REMARK

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  UPDATE_DATE?: Date; //UPDATE_DATE

  @IsString()
  @IsOptional()
  USER_UPDATE?: string; //USER_UPDATE
}