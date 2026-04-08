import { PartialType, PickType } from '@nestjs/swagger';
import { CreateIsTidDto } from './create-is-tid.dto';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
import {
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateIsTidDto extends PartialType(CreateIsTidDto) {
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    TID_COMP_DATE?: Date;

    @IsOptional()
    @Type(() => String)
    @IsString()
    TID_COMP_TIME?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    TID_DISABLE_DATE?: Date;

    @IsOptional()
    @Type(() => String)
    @IsString()
    TID_DISABLE_TIME?: string;
}

export class ActionIsTidDto extends PickType(doactionFlowDto, [
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
    @ValidateNested()
    @Type(() => UpdateIsTidDto)
    data?: UpdateIsTidDto;
}
