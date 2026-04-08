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

    @IsOptional()
    @Transform(
        ({ value }) => (Array.isArray(value) ? value.join('|') : value), // ถ้าเป็น string เดี่ยว → wrap array
    )
    @IsString()
    TID_REQNO?: string;

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

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    TID_WORKCONTENT: string;

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

export class IsTidUserData extends PickType(CreateIsTidDto, [
    'TID_REQUESTER',
    'TID_REQNO',
    'TID_REQ_DATE',
    'TID_TIMESTART',
    'TID_TIMEEND',
    'TID_SERVERNAME',
    'TID_USERLOGIN',
    'TID_CONTROLLER',
    'TID_WORKCONTENT',
    'TID_REASON',
    'TID_CHANGEDATA',
    'TID_FORMTYPE',
    'TID_LATE',
] as const) {}

export class IsTidControllerData extends PickType(CreateIsTidDto, [
    'TID_REQUESTER',
    'TID_REQ_DATE',
    'TID_TIMESTART',
    'TID_TIMEEND',
    'TID_SERVERNAME',
    'TID_USERLOGIN',
    'TID_WORKCONTENT',
    'TID_CHANGEDATA',
    'TID_FORMTYPE',
    'TID_LATE',
] as const) {}

export class CreateIsTidFormDto extends PickType(CreateFormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'REQBY',
    'INPUTBY',
    'REMARK',
] as const) {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => IsTidUserData)
    USERDATA: IsTidUserData;

    @IsOptional()
    @ValidateNested()
    @Type(() => IsTidControllerData)
    CONTROLLERDATA?: IsTidControllerData;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    FORMTYPE: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    CHANGEDATA: number;
}
