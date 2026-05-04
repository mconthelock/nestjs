import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateStyPatrolDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
]) {
    @IsNotEmpty()
    @IsString()
    @Type(() => Number)
    PA_ID: number;

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
    PA_IMAGE: number;

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
    @Type(() => Number)
    PA_MAT: number;
}
