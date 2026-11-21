import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { IDTAG_LOG } from 'src/common/Entities/innovat/table/IDTAG_LOG.entity';

@Injectable()
export class IdtagJobRepository extends BaseRepository {
    constructor(
        @InjectDataSource('mitsuConnection')
        private readonly ds: DataSource,
    ) {
        super(ds);
    }

    getPendingLogs() {
        return this.getRepository(IDTAG_LOG).find({
            where: {
                STATUS: 0,
            },
            order: {
                CREATE_DATE: 'ASC',
            },
        });
    }
}