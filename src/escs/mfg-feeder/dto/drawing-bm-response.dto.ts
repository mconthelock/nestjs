import { ApiProperty } from '@nestjs/swagger';

export class DrawingBMDataDto {
    @ApiProperty({
        example: 45,
        description: 'Drawing count PROD 1',
    })
    PROD_1: number;

    @ApiProperty({
        example: 45,
        description: 'Drawing count PROD 2',
    })
    PROD_2: number;

    @ApiProperty({
        example: 25,
        description: 'Drawing count PROD 3',
    })
    PROD_3: number;

    @ApiProperty({
        example: 28,
        description: 'Drawing count PROD 4',
    })
    PROD_4: number;

    @ApiProperty({
        example: 12,
        description: 'Drawing count PROD 5',
    })
    PROD_5: number;

    @ApiProperty({
        example: 8,
        description: 'Drawing count PROD 6',
    })
    PROD_6: number;
}


export class DrawingBMResponseDto {
    @ApiProperty({
        example: 'SUCCESS',
    })
    status: string;

    @ApiProperty({
        example: null,
        nullable: true,
    })
    message: string | null;

    @ApiProperty({
        type: DrawingBMDataDto,
    })
    data: DrawingBMDataDto;
}