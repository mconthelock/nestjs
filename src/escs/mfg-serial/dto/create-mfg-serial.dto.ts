import { Type } from 'class-transformer';
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateMfgSerialDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NDRAWINGID: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VSERIALNO?: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NTYPE: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NSTATUS?: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NUSERCREATE: number;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    DDATEUPDATE?: Date;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NUSERUPDATE?: number;
}
