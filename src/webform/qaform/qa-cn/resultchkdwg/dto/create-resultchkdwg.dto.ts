import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';
export class CreateResultchkdwgDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsNotEmpty()
    @IsString()
    DWGNO: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    RESULT?: number;

    @IsOptional()
    @IsString()
    REMARK?: string;

    @IsOptional()
    @IsString()
    REVNO?: string;
}
