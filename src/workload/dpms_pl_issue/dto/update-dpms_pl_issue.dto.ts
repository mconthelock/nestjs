import { PartialType } from '@nestjs/swagger';
import { CreateDpmsPlIssueDto } from './create-dpms_pl_issue.dto';

export class UpdateDpmsPlIssueDto extends PartialType(CreateDpmsPlIssueDto) {}
