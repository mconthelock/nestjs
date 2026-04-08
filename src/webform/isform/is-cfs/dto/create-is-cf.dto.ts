import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateIsCfDto {
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    INPUTBY: string;

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    REQBY: string;

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    REQNO: string;

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    TIDFORMNO: string;
}

export class InsertIsCfDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    CFS_REQUESTER: string;

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    CFS_REQNO: string;

    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    CFS_TID_REQNO: string;
}
