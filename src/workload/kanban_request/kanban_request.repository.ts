import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class KanbanRequestRepository extends BaseRepository {
    constructor(
        @InjectDataSource('workloadConnection') private ds: DataSource,
    ) {
        super(ds);
    }

    async getPKC_Product() {
        const result = await this.ds.query(`
            SELECT * 
            FROM PKC_PRODUCTS pp
            JOIN PKC_PRODUCT_SECTION pps ON pp.ITEM_CODE = pps.ITS_ITEM
        `);
        return result;
    }

    async getProdGroup(itemcode: string) {
        const result = await this.ds.query(
            `
            SELECT * 
            FROM PKC_PRODUCT_GROUP
            WHERE PKITEM = :1
            `,
            [itemcode],
        );
        return result;
    }

    async insertIssueKanban() {
        const result = await this.ds.query(`
            SELECT SEQ_ISSUE_KANBAN.NEXTVAL AS ID
            FROM DUAL
        `);

        const id = result[0].ID;
    }
}
