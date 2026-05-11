import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';

class ListEvaluateDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    PA_ID: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    PA_AUDIT_EVALUATE: number;
}

export class EvaluateStInpDto extends PickType(doactionFlowDto, [
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
    @Type(() => ListEvaluateDto)
    EVALUATE_LIST: ListEvaluateDto[];
}
