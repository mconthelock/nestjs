import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
import { CreatePsClmReqFormDto } from './create-ps-clm.dto';

export class UpdatePsClmDto extends PickType(doactionFlowDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
    'EMPNO',
    'ACTION',
    'REMARK',
    'CEXTDATA',
] as const) {
    @IsOptional()
    @IsString()
    @Type(() => String)
    CONTROLLER?: string;

    @IsOptional()
    DETAILS?: CreatePsClmReqFormDto['DETAILS'];
}
