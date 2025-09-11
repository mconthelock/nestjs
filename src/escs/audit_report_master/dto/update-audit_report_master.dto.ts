import { PartialType } from '@nestjs/swagger';
import { CreateESCSARMDto } from './create-audit_report_master.dto';
import { IsNotEmpty } from 'class-validator';
export class UpdateESCSARMConditionDto extends PartialType(CreateESCSARMDto) {}

export class UpdateESCSARMDto extends PartialType(CreateESCSARMDto) {
    @IsNotEmpty()
    condition: UpdateESCSARMConditionDto;
}
