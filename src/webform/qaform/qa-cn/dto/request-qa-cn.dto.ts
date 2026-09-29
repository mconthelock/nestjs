import {
    IntersectionType,
    OmitType,
    PartialType,
    PickType,
} from '@nestjs/swagger';
<<<<<<< HEAD
<<<<<<< HEAD
import { Transform, Type, plainToInstance } from 'class-transformer';
=======
import { Transform, Type } from 'class-transformer';
>>>>>>> d7bc7b33 (QA-CN)
=======
import { Transform, Type, plainToInstance } from 'class-transformer';
>>>>>>> 90141e56 (QA-CN)
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
    ArrayMinSize,
    Validate,
} from 'class-validator';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
import { RequestResultChkDwgDto } from '../resultchkdwg/dto/request-resultchkdwg.dto';
<<<<<<< HEAD
<<<<<<< HEAD
import { StringToDate } from 'src/common/utils/transform';
=======
>>>>>>> d7bc7b33 (QA-CN)
=======
import { StringToDate } from 'src/common/utils/transform';
>>>>>>> 6c278692 (QA-CN)

export class RequestCNFormDto extends PickType(CreateFormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'REQBY',
    'DRAFT',
    'INPUTBY',
    'REMARK',
] as const) {
    @IsNotEmpty()
    @IsString()
    ACTION: string;

    @IsOptional()
    @IsString()
    TITLE?: string;

    @IsOptional()
    @IsString()
    ITEMNO?: string;

    @IsOptional()
    @IsString()
    SVENDNAME?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    CLSNO?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    RSNNO?: number;

    @IsOptional()
    @IsString()
    RSNOTHER?: string;

    @IsOptional()
    @IsString()
    PRDCTNAME?: string;

    @IsOptional()
    @IsString()
    DETTRANS?: string;

    @IsOptional()
    @IsString()
    BEFCHANGE?: string;

    @IsOptional()
    @IsString()
    AFTCHANGE?: string;

    @IsOptional()
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    @StringToDate()
=======
    @IsDate()
>>>>>>> d7bc7b33 (QA-CN)
=======
>>>>>>> 38e4fc7c (QA-CN)
=======
    @StringToDate()
>>>>>>> 6c278692 (QA-CN)
    @Type(() => Date)
    SUBMITDATE?: Date;

    @IsOptional()
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    @StringToDate()
=======
    @IsDate()
>>>>>>> d7bc7b33 (QA-CN)
=======
>>>>>>> 38e4fc7c (QA-CN)
=======
    @StringToDate()
>>>>>>> 6c278692 (QA-CN)
    @Type(() => Date)
    INSPECDATE?: Date;

    @IsOptional()
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    @StringToDate()
=======
    @IsDate()
>>>>>>> d7bc7b33 (QA-CN)
=======
>>>>>>> 38e4fc7c (QA-CN)
=======
    @StringToDate()
>>>>>>> 6c278692 (QA-CN)
    @Type(() => Date)
    EXPCHGDATE?: Date;

    @IsOptional()
    @IsString()
    INSPECRESULT?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    JDGMNTNO?: number;

    @IsOptional()
    @IsString()
    INSPECRECNO?: string;

    @IsOptional()
    @IsString()
    PRTNAME?: string;

    @IsOptional()
    @IsString()
    PURITEM?: string;

    @IsOptional()
    @IsString()
    INVNO?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    ORDQ?: number;

    @IsOptional()
    @IsString()
    JDGOTHER?: string;

    @IsOptional()
    @IsString()
    PRTLOC?: string;

    @IsOptional()
    @IsString()
    TRANSNO?: string;

    @IsOptional()
    @IsString()
    RQCNREF?: string;

    @IsOptional()
    @IsString()
    ORDERNO?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    MDATE?: Date;

    @IsOptional()
    @IsString()
    MSTATUS?: string;

    @IsOptional()
    @IsString()
    RADSEC?: string;

    @IsOptional()
    @IsString()
    SEC?: string;

    @IsOptional()
    @IsString()
    RADPROCAMEC?: string;

    @IsOptional()
    @IsString()
    RADOBJ?: string;

    @IsOptional()
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 90141e56 (QA-CN)
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                // 1. แปลง String เป็น Array of Objects ธรรมดา
                const parsedValue = JSON.parse(value);

                // 2. แปลง Objects ธรรมดา ให้เป็น Class RequestResultChkDwgDto
                // เพื่อให้ ValidationPipe มองเห็น Decorators (@IsString, etc.) และไม่ตัดข้อมูลทิ้ง
                return plainToInstance(RequestResultChkDwgDto, parsedValue);
            } catch (e) {
                return value;
            }
        }
        return value;
    })
<<<<<<< HEAD
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestResultChkDwgDto)
    DWGNO?: RequestResultChkDwgDto[];
=======
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestResultChkDwgDto)
    DWGNo?: RequestResultChkDwgDto[];
>>>>>>> d7bc7b33 (QA-CN)
=======
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestResultChkDwgDto)
    DWGNO?: RequestResultChkDwgDto[];
>>>>>>> 90141e56 (QA-CN)
}
