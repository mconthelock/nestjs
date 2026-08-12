import { PartialType } from '@nestjs/swagger';
import { CreateLeaveDto } from './create-leave.dto';

export class SearchLeaveDto extends PartialType(CreateLeaveDto) {}
