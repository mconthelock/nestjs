import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { CreatePurEvaDto } from './create-pur-eva.dto';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
import { RequestPurevaFormDto } from './request-pur-eva.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdatePurEvaDto extends IntersectionType(
    PickType(doactionFlowDto, [
        'NFRMNO',
        'VORGNO',
        'CYEAR',
        'CYEAR2',
        'NRUNNO',
        'ACTION',
        'EMPNO',
        'REMARK',
    ]),
    PartialType(
        OmitType(RequestPurevaFormDto, [
            'NFRMNO',
            'VORGNO',
            'CYEAR',
            'REMARK'
        ]),
    ),
) {
    @IsOptional()
    @IsArray()
    DELETE_FILES?: string[];
}