import { PartialType } from '@nestjs/swagger';
import { CreateStyPatrolDto } from './create-sty-patrol.dto';

export class UpdateStyPatrolDto extends PartialType(CreateStyPatrolDto) {}
