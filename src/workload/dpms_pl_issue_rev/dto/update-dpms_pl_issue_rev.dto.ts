import { PartialType } from '@nestjs/swagger';
import { CreateDpmsPlIssueRevDto } from './create-dpms_pl_issue_rev.dto';

export class UpdateDpmsPlIssueRevDto extends PartialType(CreateDpmsPlIssueRevDto) {}
