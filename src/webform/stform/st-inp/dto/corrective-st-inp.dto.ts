import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from 'class-validator';
import { StringToDate } from 'src/common/utils/transform';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';

export class CorrectiveStInpDto extends PickType(doactionFlowDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
    'EMPNO',
    'ACTION',
    'REMARK',
]) {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    EMPCORRECTIVE: string;
}

class CorrectiveDetailDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    PA_ID: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    PA_EMP_CORRECTIVE: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    PA_CORRECTIVE: string;

    @IsNotEmpty()
    @StringToDate()
    @IsDate()
    PA_FINISH_DATE?: Date;

    @IsNotEmpty()
    @StringToDate()
    @IsDate()
    PA_MORNING_TALK?: Date;
}

export class CorrectiveStInpDetailDto extends PickType(doactionFlowDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
    'EMPNO',
    'ACTION',
    'REMARK',
]) {
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CorrectiveDetailDto)
    PA_LIST: CorrectiveDetailDto[];
}
