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
import { WHN_REASON } from 'src/common/Entities/innovat/table/WHN_REASON.entity';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreateDrumDto } from './dto/create-drum.dto';
import { UpdateDrumDto } from './dto/update-drum.dto';
import { DrumToStockDto } from './dto/drum-to-stock.dto';

@Injectable()
export class WireHarnessCuttingRepository extends BaseRepository {
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

<<<<<<< HEAD:src/innovat/wire-harness-cutting/wire-harness-cutting.repository.ts
    createDrum(dto: CreateDrumDto) {
        const paramOrder = ['empNo', 'itemCode', 'prodNo', 'ctrlNo', 'cut', 'cutType', 'reasonId'];
=======
    getDrumStock(condition: FiltersDto) {
        const allowedFields = ['ST_ITEMCODE', 'ST_LENREMAIN', 'ST_DRUMTYPE'];
        const qb = this.getRepository(WHN_DRUM_STOCK)
            .createQueryBuilder('A')
            .select([
                'A.ST_ITEMCODE AS ITEMCODE',
                'A.ST_PROD AS PRODNO',
                'A.ST_ID AS DRUM_ID',
                'A.ST_LENMASTER AS LENMASTER',
                'A.ST_LENREMAIN AS LENREMAIN',
                'A.ST_CABLECODE AS CABLECODE',
                'A.ST_RECIVEDATE AS RECIVEDATE',
                'A.ST_USERUPDATE AS USERUPDATE',
                'A.ST_DATEUPDATE AS DATEUPDATE',
                'A.ST_DRUMTYPE AS DRUMTYPE',
                'CONVERT_PROD(A.ST_PROD) AS PROD',
            ])
            .addSelect('CONVERT_PROD(A.ST_PROD)', 'PROD');

        return this.applyFilters(
            qb,
            'A',
            condition,
            allowedFields,
        )
        .orderBy('A.ST_LENREMAIN', 'ASC')
        .addOrderBy('A.ST_PROD', 'ASC')
        .addOrderBy('A.ST_ID', 'ASC')
        .getRawMany();
    }

    createDrum(dto: CreateDrumDto) {
        const paramOrder = ['empNo', 'itemCode', 'prodNo', 'ctrlNo', 'cut', 'cutType'];
>>>>>>> 9119de43 (wire-harness):src/innovat/wire-harness/wire-harness.repository.ts
        return this.orepo.execCursor(
            'WHN_CREATE_DRUM',
            dto,
            paramOrder,
        );
    }

    updateDrum(dto: UpdateDrumDto) {
<<<<<<< HEAD:src/innovat/wire-harness-cutting/wire-harness-cutting.repository.ts
        const paramOrder = ['empNo', 'itemCode', 'prodNo', 'drumId', 'ctrlNo', 'cut', 'cutType', 'reasonId'];
=======
        const paramOrder = ['empNo', 'itemCode', 'prodNo', 'drumId', 'ctrlNo', 'cut', 'cutType'];
>>>>>>> 9119de43 (wire-harness):src/innovat/wire-harness/wire-harness.repository.ts
        return this.orepo.execCursor(
            'WHN_UPDATE_DRUM',
            dto,
            paramOrder,
        );
    }

    drumToStock(dto: DrumToStockDto) {
        const paramOrder = ['empNo', 'itemCode', 'prodNo', 'drumId'];
        return this.orepo.execProcedure(
            'WHN_DRUM_TO_STOCK',
            dto,
            paramOrder,
        );
    }
<<<<<<< HEAD:src/innovat/wire-harness-cutting/wire-harness-cutting.repository.ts

    reason(condition: FiltersDto) {
        const allowedFields = ['RS_ID', 'RS_NAME_TH', 'RS_STATUS'];
        const qb = this.getRepository(WHN_REASON)
            .createQueryBuilder('A');

        return this.applyFilters(
            qb,
            'A',
            condition,
            allowedFields,
        )
        .orderBy('A.RS_ID', 'ASC')
        .getMany();
    }
=======
>>>>>>> 9119de43 (wire-harness):src/innovat/wire-harness/wire-harness.repository.ts
}