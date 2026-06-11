import { PartialType, PickType } from '@nestjs/swagger';
import { CreatePackingListIssueDto } from './create-packing-list-issue.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePackingListIssueDto extends PartialType(
    CreatePackingListIssueDto,
) {}

export class UpdatePlIssueProblemReasonDto extends PickType(
    CreatePackingListIssueDto,
    ['VPROD', 'VP', 'VORDERS', 'VTYPE'],
) {
    @IsNotEmpty()
    @IsString()
    VPROBLEM: string;

    @IsNotEmpty()
    @IsString()
    VREASON: string;

}
