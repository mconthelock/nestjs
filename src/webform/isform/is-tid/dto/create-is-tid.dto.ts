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
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateIsTidFormDto extends PickType(CreateFormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'REQBY',
    'INPUTBY',
    'REMARK',
] as const) {
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true }) // บอกว่าเป็น array ของ object
    @Type(() => CreateIsTidFormDto) // ต้องแปลงเป็น AttachmentDto
    USERDATA: CreateIsTidFormDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true }) // บอกว่าเป็น array ของ object
    @Type(() => CreateIsTidFormDto) // ต้องแปลงเป็น AttachmentDto
    CONTROLLERDATA?: CreateIsTidFormDto[];
}

export class CreateIsTidDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    TID_REQUESTER: string;

    @IsNotEmpty()
    @Transform(
        ({ value }) => (Array.isArray(value) ? value.join('|') : value), // ถ้าเป็น string เดี่ยว → wrap array
    )
    @IsString()
    TID_REQNO: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    TID_REQ_DATE: Date;

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    TID_TIMESTART: string;

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    TID_TIMEEND: string;

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    TID_SERVERNAME: string;

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    TID_USERLOGIN: string;

    @IsOptional()
    @Type(() => String)
    @IsString()
    TID_CONTROLLER?: string;

    @IsOptional()
    @Type(() => String)
    @IsString()
    TID_WORKCONTENT?: string;

    @IsOptional()
    @Type(() => String)
    @IsString()
    TID_REASON?: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    TID_CHANGEDATA: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    TID_FORMTYPE: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    TID_LATE: number;
}
