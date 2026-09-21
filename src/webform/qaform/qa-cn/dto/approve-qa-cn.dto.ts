import { PartialType } from '@nestjs/swagger';
import { RequestCNFormDto } from './request-qa-cn.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { Type, Transform } from 'class-transformer';
=======
import { Type } from 'class-transformer';
>>>>>>> 093c063b (QA-CN)
=======
import { Type, Transform } from 'class-transformer';
>>>>>>> 00550f31 (QA-CN)
=======
import { Type } from 'class-transformer';
>>>>>>> 093c063b (QA-CN)

export class ApproveQaCnDto extends PartialType(RequestCNFormDto) {
    @IsNotEmpty()
    @IsString()
    CYEAR2: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NRUNNO: number;

    @IsNotEmpty()
    @IsString()
    APVNO: string;

    @IsOptional()
    @IsNumber()
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    @Transform(({ value }) => (value === '' ? undefined : Number(value)))
=======
>>>>>>> 093c063b (QA-CN)
=======
    @Transform(({ value }) => (value === '' ? undefined : Number(value)))
>>>>>>> 00550f31 (QA-CN)
=======
>>>>>>> 093c063b (QA-CN)
    @Type(() => Number)
    CEXTDATA?: number;

    @IsOptional()
    @IsString()
    STEPREADY: string;

    @IsOptional()
    @IsString()
    SELJINCHRG: string;

    @IsOptional()
    @IsString()
    SELEINCHRG: string;

    @IsOptional()
    @IsString()
    OPERATOR: string;

    @IsOptional()
    @IsString()
    SELJOBTYPE: string;

    @IsOptional()
    @IsString()
    RADJUDGE: string;

    @IsOptional()
    @IsString()
    TXTJDGOTHER1: string;

    @IsOptional()
    @IsString()
    TXTJDGOTHER2: string;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 38e4fc7c (QA-CN)

    @IsOptional()
    @IsString()
    FOREMAN: string;

    @IsOptional()
    @IsString()
    PIC: string;
<<<<<<< HEAD
=======
>>>>>>> 093c063b (QA-CN)
=======
>>>>>>> 38e4fc7c (QA-CN)
=======
>>>>>>> 093c063b (QA-CN)
}
