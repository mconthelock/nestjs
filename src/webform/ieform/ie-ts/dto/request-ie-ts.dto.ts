import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
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
import { RequestIetsListeDto } from '../iets_list/dto/request-iets_list.dto';

export class RequestIetsDto extends PickType(CreateFormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'REQBY',
    'DRAFT',
    'INPUTBY',
    'REMARK',
] as const) {
    @IsNotEmpty()
    @IsString()
    JUNG: string;

    @IsNotEmpty()
    @IsString()
    TSORGNO: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestIetsListeDto)
    DWGLIST?: RequestIetsListeDto[];
}
