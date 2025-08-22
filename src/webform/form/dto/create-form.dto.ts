import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateFormDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    readonly NFRMNO: number;

    @IsNotEmpty()
    @IsString()
    readonly VORGNO: string;

    @IsNotEmpty()
    @IsString()
    readonly CYEAR: string;

    @IsNotEmpty()
    @IsString()
    readonly REQBY: string;

    @IsNotEmpty()
    @IsString()
    readonly INPUTBY: string;

    @IsOptional()
    @IsString()
    readonly REMARK?: string;

    @IsOptional()
    @IsString()
    readonly DRAFT?: string;

    // @IsNotEmpty()
    // @IsString()
    // readonly CYEAR2: string;

    // @IsNotEmpty()
    // @Type(() => Number)
    // @IsNumber()
    // readonly NRUNNO: number;

    // @IsOptional()
    // @IsString()
    // readonly VREQNO: string;

    // @IsOptional()   
    // @IsString()
    // readonly VINPUTER: string;

    // @IsOptional()
    // @IsString()
    // readonly VREMARK: string;

    // @IsOptional()
    // @IsDateString()
    // @Type(() => Date)
    // readonly DREQDATE: Date;

    // @IsOptional()
    // @IsString()
    // readonly CREQTIME: string;

    // @IsOptional()
    // @IsString()
    // readonly CST: string;

    // @IsOptional()
    // @IsString()
    // readonly VFORMPAGE: string;

    // @IsOptional()
    // @IsString()
    // readonly VREMOTE: string;
}
