import { PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class ApprovePurevaFormDto extends PickType(FormDto, [
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

    @IsString()
    EXTDATA: string;

    @IsOptional()
    @IsString()
    REMARK?: string;

    @IsOptional()
    @IsString()
    MJUDGEMENT?: string;
}
