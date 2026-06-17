import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';

export class UpdateflowPSrpDto extends PickType(doactionFlowDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
    'EMPNO',
    'ACTION',
    'REMARK',
]) {
    @IsOptional()
    @IsString()
    @Type(() => String)
    CONTROLLER?: string;
}
