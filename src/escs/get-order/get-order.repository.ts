import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateGetOrderDto } from './dto/create-get-order.dto';
import { UpdateGetOrderDto } from './dto/update-get-order.dto';
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
}
