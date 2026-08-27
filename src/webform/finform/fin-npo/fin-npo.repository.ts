import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { DS_STAMP_REPORT } from "src/common/Entities/webform/views/FINDS_STAMP_REPORT.entity";
import { DSDUTYSTAMP } from 'src/common/Entities/webform/table/FINDS_DUTY_STAMP.entity';
import { DSREQDETAIL } from 'src/common/Entities/webform/table/FINDS_REQ_DETAIL.entity';
import { DSREQHEAD } from 'src/common/Entities/webform/table/FINDS_REQ_HEAD.entity';

import { FINNPOCOSTCENTER } from 'src/common/Entities/webform/table/FINNPO_COSTCENTER.entity';

import { FINNPOFORM } from 'src/common/Entities/webform/table/FINNPO_FORM.entity';
import { FINNPOINVOICE } from 'src/common/Entities/webform/table/FINNPO_INVOICE.entity';


import { FIN_FILE } from 'src/common/Entities/webform/table/FIN_FILE.entity';
import { FINNPOEXPENSE } from 'src/common/Entities/webform/table/FINNPO_EXPENSE.entity';
import { FINNPOVENDOR } from 'src/common/Entities/webform/table/FINNPO_VENDOR.entity';
import { FINNPOCURRENCY } from 'src/common/Entities/webform/table/FINNPO_Currency.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';

import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, In } from 'typeorm';

@Injectable()
export class FinnpoRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    findAllExpense() {
        return this.getRepository(FINNPOEXPENSE).find({
            where: {
                ACTIVE: 1,
            },
            order: {
                EXPENSE_CODE: 'asc',
            },
        });
    }

    findExpenseByCode(expenseCode: number) {
        return this.getRepository(FINNPOEXPENSE).findOne({
            where: {
                EXPENSE_CODE: expenseCode,
                ACTIVE: 1,
            },
        });
    }

    findAllVendor() {
        return this.getRepository(FINNPOVENDOR).find({
            order: {
                VENDOR_CODE: 'asc',
            },
        });
    }

    findVendorByCode(vendorCode: string) {
        return this.getRepository(FINNPOVENDOR).findOne({
            where: {
                VENDOR_CODE: vendorCode,
            },
        });
    }

    findAllCurrency() {
        return this.getRepository(FINNPOCURRENCY).find({
            order: {
                CURRENCY: 'asc',
            },
        });
    }

    findAllCostCenter() {
        return this.getRepository(FINNPOCOSTCENTER).find({
            order: {
                CYEAR2: 'desc',
                NRUNNO: 'desc',
                REQNO: 'asc',
            },
        });
    }

    async createInvoices(data: Partial<FINNPOINVOICE>[]) {
        return this.getRepository(FINNPOINVOICE).save(data);
    }

    async updateInvoices(
        cyear2: string,
        nrunno: number,
        invoices: Array<{ ID: number } & Partial<FINNPOINVOICE>>,
    ) {
        await Promise.all(
            invoices.map(({ ID, ...data }) =>
                this.getRepository(FINNPOINVOICE).update(
                    { CYEAR2: cyear2, NRUNNO: nrunno, ID },
                    data,
                ),
            ),
        );
    }

    async updateHead(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        cyear2: string,
        nrunno: number,
        data: Partial<FINNPOFORM>,
    ) {
        return this.getRepository(FINNPOFORM).update(
            { NFRMNO: nfrmno, VORGNO: vorgno, CYEAR: cyear, CYEAR2: cyear2, NRUNNO: nrunno },
            data,
        );
    }

    async createCostCenters(data: Partial<FINNPOCOSTCENTER>[]) {
        return this.getRepository(FINNPOCOSTCENTER).save(data);
    }

    async replaceCostCenters(
        cyear2: string,
        nrunno: number,
        data: Partial<FINNPOCOSTCENTER>[],
    ) {
        const repository = this.getRepository(FINNPOCOSTCENTER);
        await repository.delete({ CYEAR2: cyear2, NRUNNO: nrunno });
        return data.length ? repository.save(data) : [];
    }

    async findHeadByForm(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        cyear2: string,
        nrunno: number,
    ) {
        return this.getRepository(FINNPOFORM)
            .createQueryBuilder('HEAD')
            .select('HEAD.NFRMNO', 'NFRMNO')
            .addSelect('HEAD.VORGNO', 'VORGNO')
            .addSelect('HEAD.CYEAR', 'CYEAR')
            .addSelect('HEAD.CYEAR2', 'CYEAR2')
            .addSelect('HEAD.NRUNNO', 'NRUNNO')
            .addSelect('HEAD.VENDOR_CODE', 'VENDOR_CODE')
            .addSelect('HEAD.EXPENSE_CODE', 'EXPENSE_CODE')
            .addSelect("CAST(NULL AS VARCHAR2(1000))", 'REMARK')
            .where('HEAD.NFRMNO = :NFRMNO', { NFRMNO: nfrmno })
            .andWhere('HEAD.VORGNO = :VORGNO', { VORGNO: vorgno })
            .andWhere('HEAD.CYEAR = :CYEAR', { CYEAR: cyear })
            .andWhere('HEAD.CYEAR2 = :CYEAR2', { CYEAR2: cyear2 })
            .andWhere('HEAD.NRUNNO = :NRUNNO', { NRUNNO: nrunno })
            .getRawOne();
    }

    async findDetailByForm(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        cyear2: string,
        nrunno: number,
    ) {
        return this.getRepository(FINNPOINVOICE).find({
            where: {
                CYEAR2: cyear2,
                NRUNNO: nrunno,
            },
            order: {
                ID: 'asc',
            },
        });
    }

    // ดึงไฟล์แนบของเอกสารนี้
    async findFilesByForm(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        cyear2: string,
        nrunno: number,
    ) {
        return this.getRepository(FIN_FILE).find({
            where: {
                NFRMNO: nfrmno,
                VORGNO: vorgno,
                CYEAR: cyear,
                CYEAR2: cyear2,
                NRUNNO: nrunno,
            },
            order: {
                FILE_ID: 'asc',
            },
        });
    }

    // ดึงไฟล์เดียวไว้ใช้ตอน download
    async findFileById(fileId: number) {
        return this.getRepository(FIN_FILE).findOne({
            where: {
                FILE_ID: fileId,
            },
        });
    }

    async deleteFilesByIds(fileIds: number[]) {
        if (!fileIds.length) return;
        await this.getRepository(FIN_FILE).delete({ FILE_ID: In(fileIds) });
    }

    async findOneForShow(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        cyear2: string,
        nrunno: number,
    ) {
        const head = await this.findHeadByForm(nfrmno, vorgno, cyear, cyear2, nrunno);

        const invoices = await this.findDetailByForm(
            nfrmno,
            vorgno,
            cyear,
            cyear2,
            nrunno,
        );

        const files = await this.findFilesByForm(nfrmno, vorgno, cyear, cyear2, nrunno);

        const vendor = head?.VENDOR_CODE
            ? await this.findVendorByCode(String(head.VENDOR_CODE))
            : null;
        const expense = head?.EXPENSE_CODE
            ? await this.findExpenseByCode(Number(head.EXPENSE_CODE))
            : null;

        return {
            head,
            invoices,
            files,
            vendor,
            expense,
        };
    }

    async findReport(filters: {
        formDateFrom?: string;
        formDateTo?: string;
        invoiceDateFrom?: string;
        invoiceDateTo?: string;
        expenseCode?: number;
        vendorCode?: string;
        costCenter?: string;
    }) {
        const query = this.getRepository(FINNPOFORM)
            .createQueryBuilder('HEAD')
            .innerJoin(
                FORM,
                'FORM',
                [
                    'FORM.NFRMNO = HEAD.NFRMNO',
                    'FORM.VORGNO = HEAD.VORGNO',
                    'FORM.CYEAR = HEAD.CYEAR',
                    'FORM.CYEAR2 = HEAD.CYEAR2',
                    'FORM.NRUNNO = HEAD.NRUNNO',
                ].join(' AND '),
            )
            .innerJoin(
                FINNPOINVOICE,
                'INVOICE',
                'INVOICE.CYEAR2 = HEAD.CYEAR2 AND INVOICE.NRUNNO = HEAD.NRUNNO',
            )
            .leftJoin(
                FINNPOEXPENSE,
                'EXPENSE',
                'EXPENSE.EXPENSE_CODE = HEAD.EXPENSE_CODE',
            )
            .leftJoin(
                FINNPOVENDOR,
                'VENDOR',
                'VENDOR.VENDOR_CODE = HEAD.VENDOR_CODE',
            )
            .select('HEAD.NFRMNO', 'NFRMNO')
            .addSelect('HEAD.VORGNO', 'VORGNO')
            .addSelect('HEAD.CYEAR', 'CYEAR')
            .addSelect('HEAD.CYEAR2', 'CYEAR2')
            .addSelect('HEAD.NRUNNO', 'NRUNNO')
            .addSelect("TO_CHAR(FORM.DREQDATE, 'YYYY-MM-DD')", 'FORM_DATE')
            .addSelect('FORM.VREQNO', 'REQUEST_BY')
            .addSelect('FORM.CST', 'STATUS')
            .addSelect('INVOICE.REFERENCE', 'REMARK')
            .addSelect('HEAD.EXPENSE_CODE', 'EXPENSE_CODE')
            .addSelect('EXPENSE.EXPENSE_ENAME', 'EXPENSE_TYPE')
            .addSelect('HEAD.VENDOR_CODE', 'VENDOR_CODE')
            .addSelect('VENDOR.VENDOR_NAME', 'VENDOR')
            .addSelect("TO_CHAR(INVOICE.INVOICE_DATE, 'YYYY-MM-DD')", 'INVOICE_DATE')
            .addSelect('INVOICE.INVOICE_NO', 'INVOICE_NO')
            .addSelect('INVOICE.NET_PRICE', 'NET_PRICE')
            .addSelect('INVOICE.TOTAL_AMT', 'TOTAL_AMOUNT')
            .addSelect('INVOICE.SCURCODE', 'CURRENCY')
            .addSelect('INVOICE.WHT', 'WHT')
            .addSelect(
                `(SELECT LISTAGG(CC.COSTCODE, ', ') WITHIN GROUP (ORDER BY CC.COSTCODE)
                    FROM WEBFORM.FINNPO_COSTCENTER CC
                   WHERE CC.CYEAR2 = HEAD.CYEAR2
                     AND CC.NRUNNO = HEAD.NRUNNO)`,
                'COST_CENTER',
            );

        if (filters.formDateFrom) {
            query.andWhere(
                "TRUNC(FORM.DREQDATE) >= TO_DATE(:formDateFrom, 'YYYY-MM-DD')",
                { formDateFrom: filters.formDateFrom },
            );
        }
        if (filters.formDateTo) {
            query.andWhere(
                "TRUNC(FORM.DREQDATE) <= TO_DATE(:formDateTo, 'YYYY-MM-DD')",
                { formDateTo: filters.formDateTo },
            );
        }
        if (filters.invoiceDateFrom) {
            query.andWhere(
                "TRUNC(INVOICE.INVOICE_DATE) >= TO_DATE(:invoiceDateFrom, 'YYYY-MM-DD')",
                { invoiceDateFrom: filters.invoiceDateFrom },
            );
        }
        if (filters.invoiceDateTo) {
            query.andWhere(
                "TRUNC(INVOICE.INVOICE_DATE) <= TO_DATE(:invoiceDateTo, 'YYYY-MM-DD')",
                { invoiceDateTo: filters.invoiceDateTo },
            );
        }
        if (filters.expenseCode !== undefined) {
            query.andWhere('HEAD.EXPENSE_CODE = :expenseCode', {
                expenseCode: filters.expenseCode,
            });
        }
        if (filters.vendorCode) {
            query.andWhere('HEAD.VENDOR_CODE = :vendorCode', {
                vendorCode: filters.vendorCode,
            });
        }
        if (filters.costCenter) {
            query.andWhere(
                `EXISTS (
                    SELECT 1 FROM WEBFORM.FINNPO_COSTCENTER FILTER_CC
                     WHERE FILTER_CC.CYEAR2 = HEAD.CYEAR2
                       AND FILTER_CC.NRUNNO = HEAD.NRUNNO
                       AND UPPER(FILTER_CC.COSTCODE) LIKE :costCenter
                )`,
                { costCenter: `%${filters.costCenter.toUpperCase()}%` },
            );
        }

        return query
            .orderBy('FORM.DREQDATE', 'DESC')
            .addOrderBy('HEAD.NRUNNO', 'DESC')
            .addOrderBy('INVOICE.ID', 'ASC')
            .getRawMany();
    }


    async createHead(data: Partial<FINNPOFORM>) {
        return this.getRepository(FINNPOFORM).save(data);
    }



    // async updateDateReceive(form: {
    //     NFRMNO: number;
    //     VORGNO: string;
    //     CYEAR: string;
    //     CYEAR2: string;
    //     NRUNNO: number;
    // }, dateReceive: string) {
    //     return this.getRepository(DSREQHEAD)
    //         .createQueryBuilder()
    //         .update(DSREQHEAD)
    //         .set({
    //             DATE_RECEIVE: () => "TO_DATE(:DATE_RECEIVE, 'YYYY-MM-DD')",
    //         } as any)
    //         .where('NFRMNO = :NFRMNO', { NFRMNO: form.NFRMNO })
    //         .andWhere('VORGNO = :VORGNO', { VORGNO: form.VORGNO })
    //         .andWhere('CYEAR = :CYEAR', { CYEAR: form.CYEAR })
    //         .andWhere('CYEAR2 = :CYEAR2', { CYEAR2: form.CYEAR2 })
    //         .andWhere('NRUNNO = :NRUNNO', { NRUNNO: form.NRUNNO })
    //         .setParameter('DATE_RECEIVE', dateReceive)
    //         .execute();
    // }

    // async createdetail(data: DSREQDETAIL) {
    //     return this.getRepository(DSREQDETAIL).save(data);
    // }

    // async findReport(FYEAR: number) {
    //     return this.getRepository(DS_STAMP_REPORT)
    //         .createQueryBuilder('REPORT')
    //         .select('REPORT.FYEAR', 'FYEAR')
    //         .addSelect("TO_CHAR(HEAD.DATE_RECEIVE, 'YYYY-MM-DD')", 'DATE_RECEIVE')
    //         .addSelect('REPORT.NFRMNO', 'NFRMNO')
    //         .addSelect('REPORT.VORGNO', 'VORGNO')
    //         .addSelect('REPORT.CYEAR', 'CYEAR')
    //         .addSelect('REPORT.CYEAR2', 'CYEAR2')
    //         .addSelect('REPORT.NRUNNO', 'NRUNNO')
    //         .addSelect('HEAD.OPTION_CODE', 'OPTION_CODE')
    //         .addSelect('REPORT.REASON', 'REASON')
    //         .addSelect('REPORT.VREQNO', 'VREQNO')
    //         .addSelect('REPORT.REQUESTER', 'REQUESTER')
    //         .addSelect('REPORT.BUY_1_QTY', 'BUY_1_QTY')
    //         .addSelect('REPORT.BUY_1_AMT', 'BUY_1_AMT')
    //         .addSelect('REPORT.BUY_5_QTY', 'BUY_5_QTY')
    //         .addSelect('REPORT.BUY_5_AMT', 'BUY_5_AMT')
    //         .addSelect('REPORT.BUY_10_QTY', 'BUY_10_QTY')
    //         .addSelect('REPORT.BUY_10_AMT', 'BUY_10_AMT')
    //         .addSelect('REPORT.BUY_20_QTY', 'BUY_20_QTY')
    //         .addSelect('REPORT.BUY_20_AMT', 'BUY_20_AMT')
    //         .addSelect('REPORT.WD_1_QTY', 'WD_1_QTY')
    //         .addSelect('REPORT.WD_1_AMT', 'WD_1_AMT')
    //         .addSelect('REPORT.WD_5_QTY', 'WD_5_QTY')
    //         .addSelect('REPORT.WD_5_AMT', 'WD_5_AMT')
    //         .addSelect('REPORT.WD_10_QTY', 'WD_10_QTY')
    //         .addSelect('REPORT.WD_10_AMT', 'WD_10_AMT')
    //         .addSelect('REPORT.WD_20_QTY', 'WD_20_QTY')
    //         .addSelect('REPORT.WD_20_AMT', 'WD_20_AMT')
    //         .innerJoin(
    //             DSREQHEAD,
    //             'HEAD',
    //             [
    //                 'HEAD.NFRMNO = REPORT.NFRMNO',
    //                 'HEAD.VORGNO = REPORT.VORGNO',
    //                 'HEAD.CYEAR = REPORT.CYEAR',
    //                 'HEAD.CYEAR2 = REPORT.CYEAR2',
    //                 'HEAD.NRUNNO = REPORT.NRUNNO',
    //             ].join(' AND '),
    //         )
    //         .where('REPORT.FYEAR = :FYEAR', { FYEAR })
    //         .orderBy('HEAD.DATE_RECEIVE', 'ASC')
    //         .addOrderBy('REPORT.NRUNNO', 'ASC')
    //         .getRawMany();
    // }






}
