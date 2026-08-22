import { PartialType } from '@nestjs/swagger';
import { RequestPurevaFormDto } from './request-pur-eva.dto';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdatePurEvaDto extends PartialType(RequestPurevaFormDto) {
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
