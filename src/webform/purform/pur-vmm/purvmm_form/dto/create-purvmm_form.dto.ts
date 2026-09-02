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
    VENDCAT?: string;

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
    VPAYTO?: string;

    @IsOptional()
    @IsString()
    VTYPE?: string;

    @IsOptional()
    @IsString()
    VPAYTY?: string;

    @IsOptional()
    @IsString()
    TERMCODE?: string;

    @IsOptional()
    @IsString()
    V1TIME?: string;

    @IsOptional()
    @IsString()
    VNALPH?: string;

    @IsOptional()
    @IsString()
    CONTACT?: string;

    @IsOptional()
    @IsString()
    EMAIL?: string;

    @IsOptional()
    @IsString()
    WEBSITE?: string;

    @IsOptional()
    @IsString()
    TELNO?: string;

    @IsOptional()
    @IsString()
    FAX?: string;

    @IsOptional()
    @IsString()
    ACCNUMBER?: string;

    @IsOptional()
    @IsString()
    BANKNAME?: string;

    @IsOptional()
    @IsString()
    BRANCH?: string;

    @IsOptional()
    @IsString()
    BANKADDR?: string;

    @IsOptional()
    @IsString()
    ATTACH_OTHER?: string;
}
