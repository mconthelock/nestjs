import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ISDEV_REQUEST } from 'src/common/Entities/webform/table/ISDEV_REQUEST.entity';

@Injectable()
export class DevplanRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async search(dto: FiltersDto) {
        const qb = this.manager
            .createQueryBuilder(ISDEV_REQUEST, 'dev')
            .leftJoinAndSelect('dev.category', 'ISDEV_CATEGORY')
            .leftJoinAndSelect('dev.formmaster', 'FORMMST')
            .leftJoinAndSelect('dev.obj', 'ISDEV_OBJECTIVE')
            .leftJoinAndSelect('dev.type', 'ISDEV_TYPE')
            .leftJoinAndSelect('dev.requester', 'USER')
            .leftJoinAndSelect('dev.developers', 'ISDEV_DEVELOPER')
            .leftJoinAndSelect('ISDEV_DEVELOPER.info', 'USER_INFO')
            .leftJoinAndSelect(
                'dev.status',
                'ISDEV_STATUS',
                `ISDEV_STATUS.STATUS_CLASS = 'PLAN'`,
            );
        this.applyFilters(qb, 'dev', dto, [
            'NFRMNO',
            'VORGNO',
            'CYEAR',
            'CYEAR2',
            'NRUNNO',
        ]);
        return qb.getMany();
    }
}
