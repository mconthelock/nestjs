import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateGpRbDto {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    reqCode: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    inputBy: string;
}

export class CreateStampReqDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    PURPOSE_ID: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PURPOSE_OTHER?: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    SPOSCODE: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    NAME_STAMP?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    REMARK?: string;
}

export class CreateCusStampReqDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsOptional()
    @IsString()
    @Type(() => String)
    CUST_SIZE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    QTY?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    REMARK?: string;
}
