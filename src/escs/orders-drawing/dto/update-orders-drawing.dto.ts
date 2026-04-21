import {
    IntersectionType,
    OmitType,
    PartialType,
    PickType,
} from '@nestjs/swagger';
import { CreateOrdersDrawingDto } from './create-orders-drawing.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrdersDrawingDto extends IntersectionType(
    PickType(CreateOrdersDrawingDto, [
        'ORD_PRODUCTION',
        'ORD_NO',
        'ORD_ITEM',
        'ORDDW_ID',
    ]),
    PartialType(
        OmitType(CreateOrdersDrawingDto, [
            'ORD_PRODUCTION',
            'ORD_NO',
            'ORD_ITEM',
            'ORDDW_ID',
        ]),
    ),
) {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    ORDDW_FORELEAD_STATUS: number;
}
