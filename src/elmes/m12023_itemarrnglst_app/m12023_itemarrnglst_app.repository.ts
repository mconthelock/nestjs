import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { M12023_ITEMARRNGLST_APP } from 'src/common/Entities/elmes/table/M12023_ITEMARRNGLST_APP.entity';

@Injectable()
export class M12023ItemarrnglstAppRepository extends BaseRepository {
    constructor(
        @InjectDataSource('elmesConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from M12023_ITEMARRNGLST_APP`);
        // return this.getRepository(M12023_ITEMARRNGLST_APP).find();
        return this.manager.find(M12023_ITEMARRNGLST_APP);
    }

    findOne(order: string, item: string) {
        return this.getRepository(M12023_ITEMARRNGLST_APP).findOneBy({
            ORDERNO: order,
            ITEMNO: item,
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(
            M12023_ITEMARRNGLST_APP,
            'M',
        );
        this.applyFilters(qb, 'M', dto, [
            'ORDERNO',
            'MELCALACLS',
            'ITEMNO',
            'SERIALNO',
        ]);
        return qb.getMany();
    }

    getGPL(order: string, item: string[]) {
        return this.manager
            .createQueryBuilder(M12023_ITEMARRNGLST_APP, 'M')
            .select(
                'ORDERNO, ITEMNO, SERIALNO, REGYMDHMS, UPYMDHMS, BMCLS, APNAMERMRK, PARTNO, DRAWRANK, TOTALQTY, SCNDPRTCLS, SUPPLYCLS, FINPNTCLS, UNIT, DSGELENO, STDBLK, REVSUBNO',
            )
            .where('M.ORDERNO = :order', { order })
            .andWhere('M.ITEMNO IN (:...item)', { item })
            .getRawMany();
    }
}
