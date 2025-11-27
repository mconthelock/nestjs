import { PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-scheduler.dto';

export class UpdateSchedulerDto extends PartialType(CreateJobDto) {}
