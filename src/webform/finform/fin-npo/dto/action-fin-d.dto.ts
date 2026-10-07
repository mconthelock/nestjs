import { PickType } from '@nestjs/swagger';
import { IsDateString, ValidateIf } from 'class-validator';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';

export class ActionFinDDto extends PickType(doactionFlowDto, [
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
    @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
    @IsDateString()
    DATE_RECEIVE?: string;
}
