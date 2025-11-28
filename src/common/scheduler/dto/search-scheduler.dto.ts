import { PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-scheduler.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Label } from 'src/common/helpers/label.decorator';

export class SearchSchedulerDto extends PartialType(CreateJobDto) {}
