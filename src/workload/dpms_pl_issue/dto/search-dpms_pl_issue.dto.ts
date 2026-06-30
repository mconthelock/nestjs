import { PickType } from '@nestjs/swagger';
import { CreateDpmsPlIssueDto } from 'src/workload/dpms_pl_issue/dto/create-dpms_pl_issue.dto';

export class SearchDpmsPlIssueDto extends PickType(CreateDpmsPlIssueDto, [
    'VPROD',
    'VP',
    'VTYPE',
    'VORDERS',
] as const) {}
