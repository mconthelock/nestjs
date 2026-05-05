import { PartialType } from '@nestjs/swagger';
import { CreateStyPatrolInspectionDto } from './create-sty-patrol-inspection.dto';

export class UpdateStyPatrolInspectionDto extends PartialType(CreateStyPatrolInspectionDto) {}
