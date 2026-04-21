import {
    IntersectionType,
    OmitType,
    PartialType,
    PickType,
} from '@nestjs/swagger';
import { CreatePurCpmDto, InsertPurCpmDto } from './create-pur-cpm.dto';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdatePurCpmDto extends PartialType(CreatePurCpmDto) {}

export class ReturnArppoveDto extends IntersectionType(
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
        OmitType(InsertPurCpmDto, [
            'NFRMNO',
            'VORGNO',
            'CYEAR',
            'CYEAR2',
            'NRUNNO',
        ]),
    ),
) {
    @IsOptional()
    @IsArray()
    DELETE_FILES?: string[];
}
