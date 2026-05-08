import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateStyPatrolDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
]) {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    PA_ID: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PA_OWNER?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    PA_DATE?: Date;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PA_SECTION?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PA_AUDIT?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PA_USERCREATE?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    PA_ITEMS?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PA_AREA?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PA_DETECTED?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    PA_IMAGE?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    PA_CLASS?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PA_SUGGESTION?: string;

    @IsOptional()
    @IsString()
    @Type(() => Number)
    PA_MAT?: number;
}
