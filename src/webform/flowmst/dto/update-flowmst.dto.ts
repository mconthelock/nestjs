import { PartialType } from '@nestjs/swagger';
import { CreateFlowmstDto } from './create-flowmst.dto';

export class UpdateFlowmstDto extends PartialType(CreateFlowmstDto) {}
