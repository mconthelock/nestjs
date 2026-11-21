import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { IDTAG_LOG } from 'src/common/Entities/innovat/table/IDTAG_LOG.entity';
import { F002kpService } from 'src/as400/shopf/f002kp/f002kp.service';

@Injectable()
export class IdtagRepository extends BaseRepository {
    constructor(
        @InjectDataSource('mitsuConnection')
        private readonly ds: DataSource,

        private readonly f002kpService: F002kpService,
    ) {
        super(ds);
    }

    getCurrentDateTime() {
        return this.ds.query(`
            SELECT
                TO_CHAR(SYSDATE, 'HH24MISS') AS HHMMSS,
                TO_CHAR(SYSDATE, 'YYMMDD') AS YYMMDD,
                TO_CHAR(SYSDATE, 'HH24MI') AS HHMM,
                TO_CHAR(SYSDATE, 'DD/MM/YYYY') AS FINDATE
            FROM DUAL
        `);
    }

    createLog(data: Partial<IDTAG_LOG>) {
        return this.getRepository(IDTAG_LOG).insert(data);
    }

    updateLog(controlno: string, process: string) {
        return this.getRepository(IDTAG_LOG).update(
            {
                CONTROL: controlno,
                PROCESS: process,
                STATUS: 0,
            },
            {
                STATUS: 1,
                UPDATE_DATE: () => 'SYSDATE',
            },
        );
    }

    updateTag(controlno: string, process: string, period: string, finish: number, remark: string) {
        return this.f002kpService.updateTag(
            controlno,
            process,
            period,
            finish,
            remark,
        );
    }

    cancelTag(controlno: string, process: string) {
        return this.f002kpService.cancelTag(
            controlno,
            process,
        );
    }
}