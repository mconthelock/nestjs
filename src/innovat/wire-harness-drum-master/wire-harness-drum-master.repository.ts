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
        @InjectDataSource('mitsuConnection')
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
        const groupId = dto[0].groupId;

        await repo.delete({
            GRP_ID: groupId,
        });

        const data = dto.map(item => ({
            GRP_ID: item.groupId,
            MT_ITEMCODE: item.itemCode,
            MT_CABLECODE: item.cableCode,
            MT_LENGTH: item.length,
            MT_LSLSPEC: item.lslSpec,
            MT_USERUPDATE: item.empNo,
        }));

        return repo.insert(data);
    }
}