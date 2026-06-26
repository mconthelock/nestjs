import { PartialType } from '@nestjs/swagger';
import { CreateKanbanRequestDto } from './create-kanban_request.dto';

export class UpdateKanbanRequestDto extends PartialType(CreateKanbanRequestDto) {}
