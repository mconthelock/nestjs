import { PartialType, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsDate,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { StringToDate } from 'src/common/utils/transform';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';

export class PatrolListDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    PA_ITEMS: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    PA_AREA: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    PA_DETECTED: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    PA_CLASS: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PA_SUGGESTION?: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    PA_MAT: number;
}

export class CreateStInpDto extends PickType(CreateFormDto, [
    'INPUTBY',
    'REQBY',
    'REMARK',
    'DRAFT',
]) {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    PA_OWNER: string;

    @IsNotEmpty()
    @StringToDate()
    @IsDate()
    PA_DATE: Date;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    PA_SECTION: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    PA_AUDIT: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    PA_USERCREATE: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => PatrolListDto)
    PA_LIST: PatrolListDto[];
}

export class DraftStInpDto extends PartialType(CreateStInpDto) {}
