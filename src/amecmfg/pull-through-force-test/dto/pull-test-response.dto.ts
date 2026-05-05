import { ApiProperty } from '@nestjs/swagger';
import { PullTestResultDto } from './pull-test-result.dto';

export class PullTestResponseDto {
    @ApiProperty({ example: 'SUCCESS' })
    status: 'SUCCESS' | 'ERROR';

    @ApiProperty({ nullable: true })
    message: string | null;

    @ApiProperty({ type: [PullTestResultDto], nullable: true })
    data: PullTestResultDto[] | null;
}