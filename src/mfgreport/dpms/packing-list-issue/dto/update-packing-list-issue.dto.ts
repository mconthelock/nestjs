import { PartialType, PickType } from '@nestjs/swagger';
import { CreatePackingListIssueDto } from './create-packing-list-issue.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

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

export class GetDocForShowDto extends PickType(CreatePackingListIssueDto, [
    'VPROD',
    'VP',
    'VTYPE',
    'VORDERS',
] as const) {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NDRAFT: number;
}
