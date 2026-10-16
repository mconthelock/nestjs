import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RequestResultChkDwgDto {
    @IsNotEmpty()
    @IsString()
    DWGNO: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    RESULT?: number;

    @IsOptional()
    @IsString()
    REMARK?: string;

    @IsOptional()
    @IsString()
    REVNO?: string;
}
