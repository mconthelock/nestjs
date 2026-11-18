import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { EKittingMasterDwg } from 'src/common/Entities/workload/table/EKITTING_MASTER_DWG.entity';
import { V_Q141KP_KITTING_LIST } from 'src/common/Entities/workload/views/V_Q141KP_KITTING_LIST.entity';
import { CreateEKittingDto } from './dto/create-e_kitting.dto';

@Injectable()
export class EKittingRepository extends BaseRepository {
    constructor(@InjectDataSource('mitsuConnection') private readonly wk: DataSource) {
        super(wk);
    }

    search(order, packing) {
        const result = this.wk
            .createQueryBuilder()
            .select('*')
            .from(V_Q141KP_KITTING_LIST, 'Q')
            .where('Q.S11M01 LIKE :order', { order: `_${order}_` })
            .andWhere('Q.S11M02 = :packing', { packing })
            .orderBy('Q.Q41K01,Q.Q41K03,Q.Q41K04,Q.Q41K07,TO_NUMBER(Q.Q41K05)');
        return result.getRawMany();
    }

    async getMaster(item?: string) {
        const rows = await this.getRepository(EKittingMasterDwg).find({
            where: item ? { ITEM: item } : {},
            order: { ITEM: 'ASC', DWG: 'ASC' },
        });
        const grouped = new Map<string, { ITEM: string; DWG: string[] }>();

        for (const { ITEM, DWG } of rows) {
            let item = grouped.get(ITEM);
            if (!item) {
                item = { ITEM, DWG: [] };
                grouped.set(ITEM, item);
            }
            item.DWG.push(DWG);
        }

        return Array.from(grouped.values());
    }

    async saveMaster(dto: CreateEKittingDto) {
        return this.getRepository(EKittingMasterDwg).save({
            ITEM: dto.ITEM,
            DWG: dto.DWG,
            CREATED_BY: dto.EMPNO,
            CREATED_AT: new Date(),
        });
    }

    async deleteMaster(ITEM: string, DWG: string) {
        return this.getRepository(EKittingMasterDwg).delete({ ITEM, DWG });
    }
}
