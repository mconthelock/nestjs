import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { FormDto } from 'src/webform/center/form/dto/form.dto';

export class InsertAndMoveHandleFileFormDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsNotEmpty()
    @IsString()
    @IsEnum(
        ['DD', 'FE', 'FIN', 'GP', 'IE', 'IS', 'MAR', 'MFG', 'PS', 'PUR', 'QA'],
        {
            message:
                'FORM_TYPE must be one of the following values: DD, FE, FIN, GP, IE, IS, MAR, MFG, PS, PUR, QA',
        },
    )
    FORM_TYPE: string;

    @IsOptional()
    @IsString()
    FILE_CODE?: string;

    @IsOptional()
    @IsString()
    PATH?: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CREATEBY: string;
}

export class CreateHandleFileFormDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsNotEmpty()
    @IsString()
    FILE_ONAME: string;

    @IsNotEmpty()
    @IsString()
    FILE_FNAME: string;

    @IsNotEmpty()
    @IsString()
    FILE_USERCREATE: string;

    @IsOptional()
    @Type(() => Number)
    FILE_TYPE?: number;

    @IsNotEmpty()
    @IsString()
    FILE_PATH: string;
}
