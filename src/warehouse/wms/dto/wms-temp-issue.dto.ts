import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class WMSTempIssueDto {
    @ApiProperty({ example: '6020618044' })
    @IsString()
    ISSUE: string;

    @ApiProperty({ example: '-' })
    @IsString()
    STATUS: string;

    @ApiProperty({ example: 'Q19292' })
    @IsString()
    ITEMCODE: string;

    @ApiProperty({ example: 'RING' })
    @IsString()
    DESCRIPTION: string;

    @ApiProperty({
        example: '2026026',
        description: 'Production batch number',
    })
    @IsString()
    PROD: string;

    @ApiProperty({ example: 'AB03404' })
    @IsString()
    LOCATION: string;

    @ApiProperty({
        example: 1,
        description: 'Quantity',
    })
    @Type(() => Number)
    @IsNumber()
    QTY: number;

    @ApiProperty({ example: 'B2AS2' })
    @IsString()
    ISSUETO: string;

    @ApiProperty({ example: '58240168' })
    @IsString()
    PO: string;

    @ApiProperty({ example: '1' })
    @IsString()
    LINE: string;

    @ApiProperty({ example: 'AM-6879' })
    @IsString()
    INV: string;

    @ApiProperty({ example: '250088494' })
    @IsString()
    PALLET_ID: string;

    @ApiProperty({ example: '-'})
    @IsString()
    EXPIRE_DATE?: string;
}