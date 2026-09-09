import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { WHN_PRODUCTION_PLAN } from 'src/common/Entities/innovat/table/WHN_PRODUCTION_PLAN.entity';
import { WHN_ITEM } from 'src/common/Entities/innovat/table/WHN_ITEM.entity';

@Injectable()
export class WireHarnessRepository extends BaseRepository {
    constructor(
        @InjectDataSource('innovatConnection')
        private readonly ds: DataSource,
    ) {
        super(ds);
    }

    saveProductionPlan(data: Partial<WHN_PRODUCTION_PLAN>[]) {
        return this.getRepository(WHN_PRODUCTION_PLAN).save(data);
    }

    getProductionPlan(proc: string) {
        return this.getRepository(WHN_PRODUCTION_PLAN).find({
            where: {
                PROCESS: proc
            },
        });
    }

    getItems() {
        return this.getRepository(WHN_ITEM).find({
            order: {
                ITEM_NO: 'ASC',
            },
        });
    }
}