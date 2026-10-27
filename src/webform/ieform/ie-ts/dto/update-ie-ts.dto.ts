import { PartialType } from '@nestjs/swagger';
import { RequestIetsDto } from './request-ie-ts.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateIetsDto extends PartialType(RequestIetsDto) {
    @IsNotEmpty()
    @IsString()
    ACTION: string;

    @IsNotEmpty()
    @IsString()
    EMPNO: string;

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
}
