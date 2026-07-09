import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ISSUE_KANBAN } from 'src/common/Entities/workload/table/ISSUE_KANBAN.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { CreateKanbanRequestDto } from './dto/create-kanban_request.dto';
import { ISSUE_KANBAN_DETAIL } from 'src/common/Entities/workload/table/ISSUE_KANBAN_DETAIL.entity';

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

    async getProductDetail(itemcode: string) {
        const result = await this.ds.query(
            `
            SELECT * 
            FROM PKC_PRODUCTS
            WHERE ITEM_CODE = :1
            `,
            [itemcode],
        );
        return result;
    }

    async insertIssueKanban(data: Partial<ISSUE_KANBAN>[]) {
        const result = await this.ds.query(`
            SELECT SEQ_ISSUE_KANBAN.NEXTVAL AS ID
            FROM DUAL
        `);

        const id = result[0].ID;

        const records = data.map((item) => ({
            IK_ID: id,
            REQ_SECTION: item.REQ_SECTION,
            REQ_DATE: new Date(),
            REQ_BY: item.REQ_BY,
            STATUS: item.STATUS,
            PRODUCT_CAT: item.PRODUCT_CAT,
        }));
        await this.getRepository(ISSUE_KANBAN).save(records);
        return id;
    }

    async insertIssueKanbanDetail(data: Partial<ISSUE_KANBAN_DETAIL>[]) {
        const seqResult = await this.ds.query(
            `
                SELECT SEQ_ISSUE_KANBAN_DETAIL.NEXTVAL AS ID
                FROM DUAL
                CONNECT BY LEVEL <= :1
            `,
            [data.length],
        );

        const records = data.map((item, index) => ({
            IKD_ID: seqResult[index].ID,
            IK_ID: item.IK_ID,
            ITEM_CODE: item.ITEM_CODE,
            QTY_REQ: item.QTY_REQ,
            REMARK: item.REMARK,
            QTY_PR: item.QTY_PR,
        }));

        await this.getRepository(ISSUE_KANBAN_DETAIL).save(records);

        return records.map((r) => r.IKD_ID);
    }
}
