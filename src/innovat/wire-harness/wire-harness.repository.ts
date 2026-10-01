import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { OracleRepository } from 'src/common/repositories/oracle-repository';
import { WHN_PRODUCTION_PLAN } from 'src/common/Entities/innovat/table/WHN_PRODUCTION_PLAN.entity';
import { WHN_PROCESS } from 'src/common/Entities/innovat/table/WHN_PROCESS.entity';
import { WHN_DRUM_STOCK } from 'src/common/Entities/innovat/table/WHN_DRUM_STOCK.entity';
import { WHN_PRODUCTION } from 'src/common/Entities/innovat/views/WHN_PRODUCTION.entity';
import { WHN_AUTOPLAN } from 'src/common/Entities/innovat/views/WHN_AUTOPLAN.entity';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreateDrumDto } from './dto/create-drum.dto';

@Injectable()
export class WireHarnessRepository extends BaseRepository {
    private readonly orepo: OracleRepository;
    
    constructor(
        @InjectDataSource('innovatConnection')
        private readonly ds: DataSource,
    ) {
        super(ds);
        this.orepo = new OracleRepository(ds);
    }

    saveProductionPlan(data: Partial<WHN_PRODUCTION_PLAN>[]) {
        return this.getRepository(WHN_PRODUCTION_PLAN).save(data);
    }

    getProcess() {
        return this.getRepository(WHN_PROCESS).find({
            order: {
                PRC_CODE: 'ASC',
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

    getAutoPlan(condition: FiltersDto) {
        const allowedFields = ['ITEMNO', 'PACKNO', 'PROCESS', 'PRODNO', 'P'];
        const qb = this.getRepository(WHN_AUTOPLAN).createQueryBuilder('A');
        return this.applyFilters(
            qb,
            'A',
            condition,
            allowedFields,
        ).orderBy('A.PRODNO', 'ASC')
        .addOrderBy('A.P', 'ASC')
        .addOrderBy('A.SEQBM', 'ASC')
        .addOrderBy('A.MFGNO', 'ASC')
        .addOrderBy('A.RNO', 'DESC')
        .getMany();
    }

    getDrumStock(condition: FiltersDto) {
        const allowedFields = ['ST_ITEMCODE', 'ST_LENREMAIN', 'ST_STATUS'];
        const qb = this.getRepository(WHN_DRUM_STOCK).createQueryBuilder('A');
        return this.applyFilters(
            qb,
            'A',
            condition,
            allowedFields,
        ).orderBy('A.ST_LENREMAIN', 'ASC')
        .getMany();
    }

    createDrum(dto: CreateDrumDto) {
        const paramOrder = ['empNo', 'itemCode', 'prodNo', 'ctrlNo', 'cut'];
        return this.orepo.execCursor(
            'WHN_CREATE_DRUM',
            dto,
            paramOrder,
        );
    }
}