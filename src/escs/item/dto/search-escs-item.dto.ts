import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SearchEscsItemDto {
    @ApiProperty({ required: false, example: '141' })
    @IsOptional()
    @IsString()
    readonly IT_NO?: string;

    @ApiProperty({ required: false, example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly IT_USERUPDATE?: number;

    @ApiProperty({ required: false, example: 1})
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly IT_STATUS?: number;

    @ApiProperty({ required: false, example: 3 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly SEC_ID?: number;

    @ApiProperty({ required: false, example: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly IT_QCDATE?: number;

    @ApiProperty({ required: false, example: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly IT_MFGDATE?: number;

}