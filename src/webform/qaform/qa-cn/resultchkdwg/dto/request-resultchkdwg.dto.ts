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
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
    RESULT?: number;
>>>>>>> 90141e56 (QA-CN)

    @IsOptional()
    @IsString()
    REMARK?: string;

    @IsOptional()
    @IsString()
<<<<<<< HEAD
    REVNO: string;
>>>>>>> d7bc7b33 (QA-CN)
=======
    REVNO?: string;
>>>>>>> 90141e56 (QA-CN)
=======
    RESULT: number;
=======
    RESULT?: number;
>>>>>>> 90141e56 (QA-CN)

    @IsOptional()
    @IsString()
    REMARK?: string;

    @IsOptional()
    @IsString()
<<<<<<< HEAD
    REVNO: string;
>>>>>>> d7bc7b33 (QA-CN)
=======
    REVNO?: string;
>>>>>>> 90141e56 (QA-CN)
}
