import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';
export class CreatePurvmmFormDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsNotEmpty()
    @IsString()
    REQTYPE: string;

    @IsNotEmpty()
    @IsString()
    VENDCODE: string;

    @IsNotEmpty()
    @IsString()
    VENDNAME: string;

    @IsOptional()
    @IsString()
    VENDGROUPTYPE?: string;

    @IsOptional()
    @IsString()
    TAXID?: string;

    @IsOptional()
    @IsString()
    CANO?: string;

    @IsOptional()
    @IsString()
    BANO?: string;

    @IsOptional()
    @IsString()
    CURCODE?: string;

    @IsOptional()
    @IsString()
    PAYMENTTYPE?: string;

    @IsOptional()
    @IsString()
    VENDHOLD?: string;

    @IsOptional()
    @IsString()
    VENDONETIME?: string;

    @IsOptional()
    @IsString()
    VEND1099?: string;

    @IsOptional()
    @IsString()
    TERMCODE?: string;

    @IsOptional()
    @IsString()
    SEARCHKEY?: string;

    @IsOptional()
    @IsString()
    FISCALCODE?: string;

    @IsOptional()
    @IsString()
    ACCNUMBER?: string;

    @IsOptional()
    @IsString()
    BANKNAME?: string;

    @IsOptional()
    @IsString()
    BRANCH?: string;
}
