import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RequestResultChkDwgDto {
    @IsNotEmpty()
    @IsString()
    DWGNO: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
<<<<<<< HEAD
    RESULT?: number;

    @IsOptional()
    @IsString()
    REMARK?: string;

    @IsOptional()
    @IsString()
    REVNO?: string;
=======
    RESULT: number;

    @IsOptional()
    @IsString()
    REMARK: string;

    @IsOptional()
    @IsString()
    REVNO: string;
>>>>>>> d7bc7b33 (QA-CN)
}
