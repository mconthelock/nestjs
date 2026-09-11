import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { WHN_PRODUCTION_PLAN } from 'src/common/Entities/innovat/table/WHN_PRODUCTION_PLAN.entity';
import { WHN_ITEM } from 'src/common/Entities/innovat/table/WHN_ITEM.entity';
import { WHN_PRODUCTION } from 'src/common/Entities/innovat/views/WHN_ITEM.entity';
import { WHN_AUTOPLAN } from 'src/common/Entities/innovat/views/WHN_AUTOPLAN.entity';
import { GetAutoPlanDto } from './dto/get-auto-plan.dto';

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

    getItem() {
        return this.getRepository(WHN_ITEM).find({
            order: {
                ITEM_NO: 'ASC',
            },
        });
    }

    getProduction() {
        return this.getRepository(WHN_PRODUCTION).find({
            order: {
                PRODNO: 'ASC',
            },
        });
    }

    getAutoPlan(dto: GetAutoPlanDto) {
        const where: any = {
            ITEM_NO: dto.item,
            PRODNO: dto.prod,
        };

        if (dto.p?.trim()) {
            where.P = dto.p.trim();
        }

        return this.getRepository(WHN_AUTOPLAN).find({
            where,
        });
    }
}