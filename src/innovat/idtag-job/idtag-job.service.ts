import { Injectable } from '@nestjs/common';
import { IdtagRepository } from 'src/innovat/idtag/idtag.repository';
import { IdtagJobRepository } from './idtag-job.repository';

@Injectable()
export class IdtagJobService {
    constructor(
        private readonly repo: IdtagJobRepository,
        private readonly idtagRepo: IdtagRepository,
    ) {}

    async syncIdTag() {
        const rows = await this.repo.getPendingLogs();

        for (const row of rows) {
            await this.idtagRepo.updateTag(
                row.CONTROL,
                row.PROCESS,
                row.PERIOD,
                row.FINISH_DATE,
                row.REMARK,
            );

            await this.idtagRepo.updateLog(
                row.CONTROL,
                row.PROCESS,
            );
        }

        return {
            total: rows.length,
            message: 'Sync ID Tag Success',
        };
    }
}