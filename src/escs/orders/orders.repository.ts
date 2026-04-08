import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SearchOrderDto } from './dto/search-orders.dto';
import { ORDERS } from 'src/common/Entities/escs/table/ORDERS.entity';

@Injectable()
export class OrdersRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async checkOrderPartSupply(dto: SearchOrderDto) {
        const query = this.manager
            .getRepository(ORDERS)
            .createQueryBuilder('orders');
        if (dto.ORD_NO)
            query.andWhere('orders.ORD_NO like :ordNo', {
                ordNo: `%${dto.ORD_NO}%`,
            });
        if (dto.ORD_ITEM)
            query.andWhere('orders.ORD_ITEM like :ordItem', {
                ordItem: `${dto.ORD_ITEM}%`,
            });
        if (dto.ORD_PRODUCTION)
            query.andWhere('orders.ORD_PRODUCTION = :ordProduction', {
                ordProduction: dto.ORD_PRODUCTION,
            });

        query.andWhere(
            "((orders.ORT_ID = 5 AND NOT(ORD_NO LIKE 'ET9%' AND ORD_MODEL='VPC')) OR (ORT_ID IN (4,6)))",
        );
        return await query.getMany();

       
    }
}
