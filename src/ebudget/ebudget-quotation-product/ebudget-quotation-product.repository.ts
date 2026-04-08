import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { EBUDGET_QUOTATION_PRODUCT } from 'src/common/Entities/ebudget/table/EBUDGET_QUOTATION_PRODUCT.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { CreateEbudgetQuotationProductDto } from './dto/create-ebudget-quotation-product.dto';

@Injectable()
export class EbudgetQuotationProductRepository extends BaseRepository {
    constructor(
        @InjectDataSource('ebudgetConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getData(id: number) {
        return this.getRepository(EBUDGET_QUOTATION_PRODUCT).find({
            where: {
                QUOTATION_ID: id,
            },
            order: {
                SEQ: 'ASC',
            },
        });
    }

    async insert(dto: CreateEbudgetQuotationProductDto) {
        return this.manager.save(EBUDGET_QUOTATION_PRODUCT, dto);
    }
}
