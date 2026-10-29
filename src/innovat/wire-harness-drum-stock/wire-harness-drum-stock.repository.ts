import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { WHN_DRUM_STOCK } from 'src/common/Entities/innovat/table/WHN_DRUM_STOCK.entity';
import { WHN_DRUMSTOCK } from 'src/common/Entities/innovat/views/WHN_DRUMSTOCK.entity';
import { WHN_DRUMORDER } from 'src/common/Entities/innovat/views/WHN_DRUMORDER.entity';
import { ScrapDrumDto } from './dto/scrap-drum.dto';

@Injectable()
export class WireHarnessDrumStockRepository extends BaseRepository {
    constructor(
        @InjectDataSource('innovatConnection')
        private readonly ds: DataSource,
    ) {
        super(ds);
    }

    list(condition: FiltersDto) {
        const allowedFields = ['ITEMCODE', 'LENREMAIN', 'DRUMTYPE', 'RECIVEDATE', 'GRPID'];
        const qb = this.getRepository(WHN_DRUMSTOCK)
            .createQueryBuilder('A');

        return this.applyFilters(
            qb,
            'A',
            condition,
            allowedFields,
        )
        .orderBy('A.LENREMAIN', 'ASC')
        .addOrderBy('A.PRODNO', 'ASC')
        .addOrderBy('A.DRUMID', 'ASC')
        .getMany();
    }

    scrapDrum(dto: ScrapDrumDto) {
        return this.getRepository(WHN_DRUM_STOCK).update(
            {
                ST_ITEMCODE: dto.itemCode,
                ST_PROD: dto.prodNo,
                ST_ID: dto.drumId,
            },
            {
                ST_DRUMTYPE: 3,
                ST_USERUPDATE: dto.empNo,
                ST_DATEUPDATE: new Date(),
            },
        );
    }

    selectDrum(condition: FiltersDto) {
        const allowedFields = ['CTRLNO', 'RN'];
        const qb = this.getRepository(WHN_DRUMORDER)
            .createQueryBuilder('A');

        return this.applyFilters(
            qb,
            'A',
            condition,
            allowedFields,
        )
        .getOne();
    }
}