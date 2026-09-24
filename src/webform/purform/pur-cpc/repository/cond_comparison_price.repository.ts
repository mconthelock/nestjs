import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { COND_COMPARISON_PRICE } from 'src/common/Entities/webform/table/COND_COMPARISON_PRICE.entity';

@Injectable()
export class CondComparisonPriceRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getActive() {
        return this.getRepository(COND_COMPARISON_PRICE).find({
            where: {
                STATUS: 1,
            },
            order: {
                NO: 'ASC'
            }
        });
    }
}
