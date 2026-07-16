import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateDeveloperDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    DEV_SEQ: number;

    @IsNotEmpty()
    @IsString()
    DEV_PIC: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    DEV_PLANTIME: number;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    DEV_PLANSTART: Date;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    DEV_PLANEND: Date;

    @IsNotEmpty()
    @IsString()
    DEV_TITLE: string;
}
