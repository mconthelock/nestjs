import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { ToBoolean } from 'src/common/utils/transform';
import { PcpDetailsDto } from './create-pcp-details.dto';

export class CreatePcpFormDto {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CYEAR2: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NRUNNO: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VREQNO: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VINPUTER: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NFUNCTIONS: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NTOTAL_PRES: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NTOTAL_NEW: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NTOTAL_COST: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NTOTAL_RATIO: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VVENDOR: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(['A', 'E'])
    @Type(() => String)
    CMODE: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NSTATUS: number;
}

export class CreateFormDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    FUNC: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    REQBY: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    INPUTBY: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    STATUS: number;

    @IsNotEmpty()
    @ToBoolean()
    @IsBoolean()
    ISEDIT: boolean;

    @IsOptional()
    @IsString()
    @Type(() => String)
    FORMEDIT?: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(['A', 'E'])
    @Type(() => String)
    MODE: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    TOTAL_PRES: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    TOTAL_NEW: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    TOTAL_COST: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    TOTAL_RATIO: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VENDOR: string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PcpDetailsDto)
    DETAILS: PcpDetailsDto[];
}
