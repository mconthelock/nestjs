import { PartialType } from '@nestjs/swagger';
import { CreateFlowDto } from './create-flow.dto';
import { IsOptional } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';

export class UpdateFlowDto extends PartialType(CreateFlowDto) {
    @IsOptional()
    condition?: any;
}

export class DeleteFlowStepDto extends PickType(CreateFlowDto, [
    'NFRMNO', 'VORGNO', 'CYEAR', 'CYEAR2', 'NRUNNO', 'CSTEPNO', 'CEXTDATA'
  ]  as const ) {
}