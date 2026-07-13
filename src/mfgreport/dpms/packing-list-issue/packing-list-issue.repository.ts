import { Injectable } from '@nestjs/common';
import { OracleRepository } from 'src/common/repositories/oracle-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SearchDpmsPlIssueDto } from 'src/workload/dpms_pl_issue/dto/search-dpms_pl_issue.dto';
import { GetDocForShowDto } from './dto/update-packing-list-issue.dto';

@Injectable()
export class PackingListIssueProcedureWorkloadRepository extends OracleRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getReportProdList(prod: string) {
        return this.execCursor('DPMS_PL_PROD_REPORT', { prod }, ['prod']);
    }

    async getReportDayList(day: string) {
        return this.execCursor('DPMS_PL_DAY_REPORT', { day }, ['day']);
    }

    async getLastRevDocument(dto: SearchDpmsPlIssueDto){
        return this.execCursor('DPMS_PL_DOC_FOR_REVISE', dto, ['VPROD', 'VP', 'VTYPE', 'VORDERS']);
    }

    async getDocforShow(dto: GetDocForShowDto){
        return this.execCursor('DPMS_PL_DOC', dto, ['VPROD', 'VP', 'VTYPE', 'VORDERS', 'NDRAFT']);
    }
}

export class PackinglistIssueProcedureDataCenterRepository extends OracleRepository {
    constructor(@InjectDataSource('datacenterConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getShopOrder(ordermain: string) {
        return this.execCursor('DPMS_PL_SHOP_ORDER', { ordermain }, ['ordermain']);
    }
}