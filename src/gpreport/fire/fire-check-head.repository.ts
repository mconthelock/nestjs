import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FireCheckHead } from 'src/common/Entities/gpreport/table/FIRE_CHECK_HEAD.entity';
import { transactionContext } from 'src/common/interceptors/transaction-context';
import { FireCheckHeadKeyDto } from './dto/fire-check-key.dto';
import { SearchFireCheckHeadDto } from './dto/search-fire-check-head.dto';

@Injectable()
export class FireCheckHeadRepository extends BaseRepository {
    constructor(@InjectDataSource('mitsuConnection') dataSource: DataSource) {
        super(dataSource);
    }

    // Reuse an existing transaction; otherwise bind the transaction manager to
    // the same context consumed by BaseRepository, including direct Service calls.
    withCheckTransaction<T>(work: () => Promise<T>): Promise<T> {
        const manager = this.manager;
        if (manager.queryRunner?.isTransactionActive) return work();
        return manager.transaction((txManager) =>
            transactionContext.run({ ...transactionContext.getStore(), manager: txManager }, work),
        );
    }

    checkTransactionActive() {
        return !!this.manager.queryRunner?.isTransactionActive;
    }

    findInspectionHead(AREA: string, FMONTH: string, FYEAR: string) {
        return this.getRepository(FireCheckHead).findOne({
            where: {
                AREA,
                FYEAR,
                FMONTH: In([...new Set([FMONTH, String(Number(FMONTH))])]),
            },
        });
    }

    findCheckHead(key: FireCheckHeadKeyDto, lock = false) {
        const repo = this.getRepository(FireCheckHead);
        if (lock) {
            // Match the complete PK without a row-limiting clause on Oracle.
            return repo.createQueryBuilder('H').where(key).setLock('pessimistic_write').getOne();
        }
        return repo.findOne({ where: key });
    }

    async searchCheckHeads(query: SearchFireCheckHeadDto) {
        const { page = 1, limit = 20, ...where } = query;
        const [data, total] = await this.getRepository(FireCheckHead).findAndCount({
            where,
            order: { NFRMNO: 'ASC', VORGNO: 'ASC', CYEAR: 'ASC', CYEAR2: 'ASC', NRUNNO: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async createCheckHead(data: FireCheckHead) {
        await this.getRepository(FireCheckHead).insert(data);
        const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO } = data;
        return this.findCheckHead({ NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO });
    }

    updateCheckHead(key: FireCheckHeadKeyDto, data: Partial<FireCheckHead>) {
        return this.getRepository(FireCheckHead).update(key, data);
    }

    deleteCheckHead(key: FireCheckHeadKeyDto) {
        return this.getRepository(FireCheckHead).delete(key);
    }
}
