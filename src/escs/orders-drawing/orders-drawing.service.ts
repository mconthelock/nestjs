import { Injectable } from '@nestjs/common';
import { CreateOrdersDrawingDto } from './dto/create-orders-drawing.dto';
import { UpdateOrdersDrawingDto } from './dto/update-orders-drawing.dto';
import { OrdersDrawingRepository } from './orders-drawing.repository';

@Injectable()
export class OrdersDrawingService {
    constructor(
        private readonly repo: OrdersDrawingRepository,
    ) {}

    async update(dto: UpdateOrdersDrawingDto) {
        try {
            const condition = {
                ORD_PRODUCTION: dto.ORD_PRODUCTION,
                ORD_ITEM: dto.ORD_ITEM,
                ORD_NO: dto.ORD_NO,
                ORDDW_ID: dto.ORDDW_ID,
            };
            const res = await this.repo.update(condition, dto);
            if (res.affected === 0) {
                return {
                    status: false,
                    message: `Update ORDERS_DRAWING Failed`,
                };
            }
            return {
                status: true,
                message: `Update ORDERS_DRAWING Successfully`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Update ORDERS_DRAWING Error: ` + error.message,
            );
        }
    }
}
