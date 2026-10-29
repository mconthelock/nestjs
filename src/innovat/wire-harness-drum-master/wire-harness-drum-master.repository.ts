import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { WHN_DRUM_MASTER } from 'src/common/Entities/innovat/table/WHN_DRUM_MASTER.entity';
import { DrumMasterDto } from './dto/drum-master.dto';

@Injectable()
export class WireHarnessDrumMasterRepository extends BaseRepository {
    constructor(
        @InjectDataSource('innovatConnection')
        private readonly ds: DataSource,
    ) {
        super(ds);
    }

    list(condition: FiltersDto) {
        const allowedFields = ['MT_ITEMCODE', 'MT_CABLECODE', 'GRP_ID'];
        const qb = this.getRepository(WHN_DRUM_MASTER)
            .createQueryBuilder('A');

        return this.applyFilters(
            qb,
            'A',
            condition,
            allowedFields,
        )
        .orderBy('A.MT_ITEMCODE', 'ASC')
        .getMany();
    }

    async save(dto: DrumMasterDto[]) {
        const repo = this.getRepository(WHN_DRUM_MASTER);
        const groupId   = dto[0].groupId;
        const itemCodes = dto.map(item => item.itemCode);

        await repo.createQueryBuilder()
            .delete()
            .from(WHN_DRUM_MASTER)
            .where('GRP_ID = :groupId', { groupId })
            .andWhere('MT_ITEMCODE NOT IN (:...itemCodes)', { itemCodes })
            .execute();

        const data = dto.map(item => ({
            MT_ITEMCODE: item.itemCode,
            GRP_ID: item.groupId,
            MT_CABLECODE: item.cableCode,
            MT_LENGTH: item.length,
            MT_LSLSPEC: item.lslSpec,
            MT_USERUPDATE: item.empNo,
            MT_DATEUPDATE: new Date(),
        }));

        return repo.save(data);
    }
}