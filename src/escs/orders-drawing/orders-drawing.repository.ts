import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UpdateOrdersDrawingDto } from './dto/update-orders-drawing.dto';
import { ORDERS_DRAWING } from 'src/common/Entities/escs/table/ORDERS_DRAWING.entity';

@Injectable()
export class OrdersDrawingRepository extends BaseRepository {
    constructor(@InjectDataSource('escsConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async update(
        condition: {
            ORD_PRODUCTION: string;
            ORD_ITEM: string;
            ORD_NO: string;
            ORDDW_ID: number;
        },
        dto: UpdateOrdersDrawingDto,
    ) {
        return this.getRepository(ORDERS_DRAWING).update(condition, dto);
    }
}
