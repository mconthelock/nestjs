import { ApiProperty } from '@nestjs/swagger';

export class GetOrderResponseDto {
    @ApiProperty({ example: 'E8BE11016' })
    orderNo: string;

    @ApiProperty({ example: 'MODEL-X' })
    typeModel: string;
}