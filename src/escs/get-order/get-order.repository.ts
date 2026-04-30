import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { GetOrderDto } from './dto/get-order.dto';
import { GET_ORDER } from 'src/common/Entities/escs/views/GET_ORDER.entity';

@Injectable()
export class GetOrderRepository extends BaseRepository {
    constructor(@InjectDataSource('escsConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findOne(prod: string, ordNo: string, item: string, id: number) {
        return this.getRepository(GET_ORDER).findOne({
            where: {
                ORD_PRODUCTION: prod,
                ORD_NO: ordNo,
                ORD_ITEM: item,
                ORDDW_ID: id,
            },
        });
    }

    findOrder(dto: GetOrderDto) {
        return this.getRepository(GET_ORDER)
            .createQueryBuilder('o')
            .select([
                `o.TYPE_MODEL AS TYPE_MODEL`,
                `CASE 
                    WHEN o.ORT_ID = 5 THEN o.ORDER_ID 
                    ELSE o.ORD_NO 
                 END AS ORDERNO`,
            ])
            .where('o.ORD_PRODUCTION = :prod', { prod: dto.prod })
            .andWhere('o.ORD_NO = :order', { order: dto.order })
            .andWhere('o.ORD_ITEM = :item', { item: dto.item })
            .andWhere('o.ORDDW_ID = :dwgId', { dwgId: dto.dwgId })
            .getRawMany();
    }
}
