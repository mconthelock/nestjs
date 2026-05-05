import { ApiProperty } from '@nestjs/swagger';
import { GovernorTestResultDto } from './governor-test-result.dto';

export class GovernorTestResponseDto {
    @ApiProperty({ example: 'SUCCESS' })
    status: 'SUCCESS' | 'ERROR';

    @ApiProperty({ nullable: true })
    message: string | null;

    @ApiProperty({ type: [GovernorTestResultDto], nullable: true })
    data: GovernorTestResultDto[] | null;
}