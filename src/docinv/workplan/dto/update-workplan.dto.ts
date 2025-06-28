import { PartialType } from '@nestjs/swagger';
import { CreateWorkplanDto } from './create-workplan.dto';

export class UpdateWorkplanDto extends PartialType(CreateWorkplanDto) {}
