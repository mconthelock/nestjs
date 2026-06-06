import { PartialType } from '@nestjs/swagger';
import { CreatePackingListIssueDto } from './create-packing-list-issue.dto';

export class UpdatePackingListIssueDto extends PartialType(CreatePackingListIssueDto) {}
