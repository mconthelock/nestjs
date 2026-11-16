import {
    IntersectionType,
    OmitType,
    PartialType,
    PickType,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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
import { UpdateIetsListDto } from '../iets_list/dto/update-iets_list.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class ApproveIetsDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsString()
    ACTION: string;

    @IsString()
    EMPNO: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) =>
        value !== undefined && value !== null ? Number(value) : value,
    )
    EXTDATA?: Number;

    @IsOptional()
    @IsString()
    REMARK?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateIetsListDto)
    DWGLIST?: UpdateIetsListDto[];
}
