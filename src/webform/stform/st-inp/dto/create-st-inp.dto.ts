import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    PA_SUGGESTION: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    PA_MAT: string;
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
    @IsDate()
    @Type(() => Date)
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
    @Type(() => PatrolListDto)
    PA_LIST: PatrolListDto[];
}

export class DraftStInpDto extends PartialType(CreateStInpDto) {}
