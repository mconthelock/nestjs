import { PartialType } from '@nestjs/swagger';
import { CreateFlowDto } from './create-flow.dto';
import { IsOptional } from 'class-validator';

export class UpdateFlowDto extends PartialType(CreateFlowDto) {
    @IsOptional()
    condition?: any;
}
