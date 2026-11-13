import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, Matches, ValidateNested } from 'class-validator';
import { CreateFireCheckHeadDto } from './create-fire-check-head.dto';
import { CreateFireCheckDetailDto } from './create-fire-check-detail.dto';

export class FireInspectionItemDto extends PickType(CreateFireCheckDetailDto, [
    'FIRE_CODE', 'GAGE', 'WEIGHT', 'PIN', 'HOSE', 'CLEAN', 'DETAIL', 'CHECK_DATE',
] as const) {}

export class CreateFireInspectionDto extends CreateFireCheckHeadDto {
    @Matches(/^(0[1-9]|1[0-2])$/)
    FMONTH: string;

    @Matches(/^\d{4}$/)
    FYEAR: string;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(999)
    @ValidateNested({ each: true })
    @Type(() => FireInspectionItemDto)
    items: FireInspectionItemDto[];
}
