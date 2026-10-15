import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { StringToDate } from 'src/common/utils/transform';
import { FormDto } from 'src/webform/form/dto/form.dto';

=======
import { FormDto } from 'src/webform/form/dto/form.dto';
>>>>>>> 67c79348 (PUR-EVA)
=======
import { StringToDate } from 'src/common/utils/transform';
import { FormDto } from 'src/webform/form/dto/form.dto';

>>>>>>> 6c278692 (QA-CN)
=======
import { FormDto } from 'src/webform/form/dto/form.dto';
>>>>>>> 67c79348 (PUR-EVA)
export class CreateCnformDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
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
<<<<<<< HEAD
<<<<<<< HEAD
    @StringToDate()
=======
    @IsDate()
>>>>>>> 67c79348 (PUR-EVA)
=======
>>>>>>> 38e4fc7c (QA-CN)
=======
    @StringToDate()
>>>>>>> 6c278692 (QA-CN)
=======
    @IsDate()
>>>>>>> 67c79348 (PUR-EVA)
=======
>>>>>>> 38e4fc7c (QA-CN)
    @Type(() => Date)
    @IsDate()
    SUBMITDATE?: Date;

    @IsOptional()
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    @StringToDate()
=======
    @IsDate()
>>>>>>> 67c79348 (PUR-EVA)
=======
>>>>>>> 38e4fc7c (QA-CN)
=======
    @StringToDate()
>>>>>>> 6c278692 (QA-CN)
=======
    @IsDate()
>>>>>>> 67c79348 (PUR-EVA)
=======
>>>>>>> 38e4fc7c (QA-CN)
    @Type(() => Date)
    @IsDate()
    INSPECDATE?: Date;

    @IsOptional()
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    @StringToDate()
=======
    @IsDate()
>>>>>>> 67c79348 (PUR-EVA)
=======
>>>>>>> 38e4fc7c (QA-CN)
=======
    @StringToDate()
>>>>>>> 6c278692 (QA-CN)
=======
    @IsDate()
>>>>>>> 67c79348 (PUR-EVA)
=======
>>>>>>> 38e4fc7c (QA-CN)
    @Type(() => Date)
    @IsDate()
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
}
