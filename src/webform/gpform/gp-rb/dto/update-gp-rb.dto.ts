import { PartialType, PickType } from '@nestjs/swagger';
// import { CreateGpRbDto, CreateStampReqDto } from './create-gp-rb.dto';
// import { ShowstampGpRbRepository } from '../gp-rb.repository';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
import { partials } from 'handlebars';

export class UpdateNamestampdto extends PickType(doactionFlowDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
    'EMPNO',
    'ACTION',
    'REMARK',
] as const) {
    @IsOptional()
    @IsString()
    @Type(() => String)
    NAME_STAMP: string;
}
