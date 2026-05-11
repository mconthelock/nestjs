import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { StringToDate } from 'src/common/utils/transform';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateStinpFormDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
]) {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VOWNER: string;

    @IsNotEmpty()
    @StringToDate()
    @IsDate()
    DDATE: Date;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VSECTION: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VAUDIT: string;
}
