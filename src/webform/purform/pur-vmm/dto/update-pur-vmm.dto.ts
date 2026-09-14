import { PartialType } from '@nestjs/swagger';
import { RequestPurvmmFormDto } from './request-pur-vmm.dto';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdatePurVmmDto extends PartialType(RequestPurvmmFormDto) {
    // กำหนดฟิลด์บังคับเฉพาะตอน Update ที่ส่งมาจาก FormData / Flow
    @IsNotEmpty()
    @IsString()
    ACTION: string;

    @IsNotEmpty()
    @IsString()
    EMPNO: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) =>
        value !== undefined && value !== null ? Number(value) : value,
    )
    NFRMNO: number;

    @IsNotEmpty()
    @IsString()
    VORGNO: string;

    @IsNotEmpty()
    @IsString()
    CYEAR: string;

    @IsNotEmpty()
    @IsString()
    CYEAR2: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) =>
        value !== undefined && value !== null ? Number(value) : value,
    )
    NRUNNO: number;

    @IsArray()
    @IsOptional()
    DELETE_FILES?: string[];
}

export class ApprovePurVmmDto extends PartialType(UpdatePurVmmDto) {
    @IsOptional()
    @IsString()
    EVANO?: string;

    @IsNotEmpty()
    @IsString()
    BUYER: string;
}
