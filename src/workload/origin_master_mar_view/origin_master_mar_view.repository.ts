import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SearchOriginMasterMarViewDto } from './dto/search.dto';
import { ORIGIN_MASTER_MAR_VIEW } from 'src/common/Entities/workload/views/ORIGIN_MASTER_MAR_VIEW.entity';

@Injectable()
export class OriginMasterMarViewRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    find(data: SearchOriginMasterMarViewDto[]) {
        const qb = this.getRepository(ORIGIN_MASTER_MAR_VIEW).createQueryBuilder('O');
        if(data.length > 0) {
            const condition = {
                OR: []
            };
            for(const d of data) {
                const and = [];
                if(d.DRAWING) {
                    and.push({
                        field: 'DRAWING',
                        op: 'like',
                        value: d.DRAWING
                    });
                }
                if(d.ITEMNO) {
                    and.push({
                        field: 'ITEMNO',
                        op: 'eq',
                        value: d.ITEMNO
                    });
                }
                if(d.PARTNAME) {
                    and.push({
                        field: 'PARTNAME',
                        op: 'like',
                        value: d.PARTNAME
                    });
                }
                if(and.length > 0) {
                    condition.OR.push({
                        AND: and
                    });
                }
            }
            this.applyFilters(qb, 'O', condition, ['DRAWING', 'ITEMNO', 'PARTNAME']);
        }
        qb.orderBy('O.DRAWING', 'ASC')
            .addOrderBy('O.PARTNAME', 'ASC')
            .addOrderBy('O.ITEMNO', 'ASC')
            .addOrderBy('O.PURCODE', 'ASC');
        return qb.getMany();
    }
    
}
