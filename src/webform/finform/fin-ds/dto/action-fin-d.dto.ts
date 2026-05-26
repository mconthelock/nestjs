import { PickType } from '@nestjs/swagger';
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
] as const) {}
