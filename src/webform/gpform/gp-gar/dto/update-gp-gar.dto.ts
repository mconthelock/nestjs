import { PartialType, PickType } from '@nestjs/swagger';
import { CreateGpGarDto } from './create-gp-gar.dto';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';



export class UpdateGpGarDto extends PickType(doactionFlowDto, [
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
    @Type(()=> String)
    CONTROLLER? : string;
}

