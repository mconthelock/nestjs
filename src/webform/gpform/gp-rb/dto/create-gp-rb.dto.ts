import { IntersectionType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateStampReqDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    PURPOSE_ID?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PURPOSE_OTHER?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    SPOSCODE?: string;

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
    @IsNumber()
    @Type(() => Number)
    QTY?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    REMARK?: string;
}

export class CreateGpRbtempDto extends IntersectionType(
    PickType(CreateFormDto, ['INPUTBY', 'REQBY', 'REMARK'] as const),
    PickType(CreateStampReqDto, [
        'PURPOSE_ID',
        'PURPOSE_OTHER',
        'SPOSCODE',
        'NAME_STAMP',
    ] as const),
) {
    @IsOptional()
    @IsString()
    @Type(() => String)
    STAMP_REMARK?: string;
}

export class CreateGpRbDto extends IntersectionType(
    CreateGpRbtempDto,
    PickType(CreateCusStampReqDto, ['CUST_SIZE', 'QTY', 'REMARK'] as const),
) {
    @IsOptional()
    @IsString()
    @Type(() => String)
    STAMPCUS_REMARK?: string;
}
