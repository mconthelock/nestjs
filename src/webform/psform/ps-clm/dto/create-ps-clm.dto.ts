import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';

export class CreatePsClmDetailDto {
    @IsOptional()
    @IsString()
    @Type(() => String)
    ORDERNO?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    ITEM?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PARTNAME?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    DRAWING?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VARIABLE?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    QTY?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    SCLNO?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    SCLTYPE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    SCHDNUM?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    SCHDP?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    ISSUETO?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    NEXTPROCESS?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    REMARK?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    REMARKTABLE?: string;
}

export class CreatePsClmFormDto extends PickType(CreateFormDto, [
    'REQBY',
    'INPUTBY',
    'REMARK',
] as const) {
    @IsOptional()
    @IsString()
    @Type(() => String)
    NEWORDER?: string;

    @IsOptional()
    DETAILS?: CreatePsClmDetailDto[] | string;
}

export class CreatePsClmReqFormDto extends PartialType(CreatePsClmFormDto) {}
