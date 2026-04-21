import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { PickType } from '@nestjs/swagger';
import { FormDto } from 'src/webform/form/dto/form.dto';
export class insertFlowDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    NEWSTEPNO: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    APVNO?: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    BEFORESTEPNO: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    POSNO?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    APVORGNO?: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CTYPE: string;
}
