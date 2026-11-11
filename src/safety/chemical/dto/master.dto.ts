import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class OwnOrgDto {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    EMPNO: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    GROUP?: string;
}

export class RebuildSectionDto {
    @IsNotEmpty()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    ID: number[];
}