import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
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
import { doactionFlowDto } from 'src/webform/center/flow/dto/doaction-flow.dto';
import { CreateFormDto } from 'src/webform/center/form/dto/create-form.dto';

export class PatrolListDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    PA_ID?: number;

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

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PatrolListDto)
    PA_LIST?: PatrolListDto[];
}

export class DraftStInpDto extends IntersectionType(
    PickType(doactionFlowDto, [
        'NFRMNO',
        'VORGNO',
        'CYEAR',
        'CYEAR2',
        'NRUNNO',
        'EMPNO',
        'ACTION',
        'REMARK',
    ]),
    PartialType(CreateStInpDto),
) {}
