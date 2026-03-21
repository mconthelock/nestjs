import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { ToBoolean } from 'src/common/utils/transform';

export class CreateMfgDrawingDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NBLOCKID: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NITEMID: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VPIS?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VCONTROLNO?: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VDRAWING: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NINSPECTOR_STATUS: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NFORELEAD_STATUS: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VFULL_PATH: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VFILE_NAME: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NUSERCREATE: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NSTATUS?: number;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    DDATEUPDATE?: Date;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NUSERUPDATE?: number;
}

export class CreateMfgDrawingCheckSheetDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NBLOCKID: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NITEMID: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VPIS?: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    ASERIALNO: string[];

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NUSERCREATE: number;

    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    REVISE: boolean;
}
