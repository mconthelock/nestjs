import { PartialType } from '@nestjs/swagger';
import { CreateTaskscheduleDto } from './create-taskschedule.dto';

export class UpdateTaskscheduleDto extends PartialType(CreateTaskscheduleDto) {}
