import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MFGVTR_DETAIL } from 'src/common/Entities/webform/table/MFGVTR_DETAIL.entity';
import { MFGVTR_FORM } from 'src/common/Entities/webform/table/MFGVTR_FORM.entity';
import { Products } from 'src/common/Entities/pursys/table/PRODUCTS.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, In } from 'typeorm';

@Injectable()
export class MfgVtrRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @InjectDataSource('purConnection') private purConnection: DataSource,
    ) {
        super(ds);
    }

    async createRequest(
        headData: Partial<MFGVTR_FORM>,
        details: Array<Partial<MFGVTR_DETAIL>>,
    ) {
        console.log(headData, details);
        const head = await this.getRepository(MFGVTR_FORM).save(headData);

        const form_id = head.ID;

        console.log('form_id', form_id);

        await this.getRepository(MFGVTR_DETAIL).save(
            details.map((detail) => ({
                FORM_ID: form_id,
                PRODUCT_ID: detail.PRODUCT_ID,
                QTY: detail.QTY,
            })),
        );

        return head;
    }

    async getRequest() {
        const forms = await this.getRepository(MFGVTR_FORM).find({
            relations: ['DETAILS'],
        });

        const productIds = [
            ...new Set(
                forms.flatMap((form) =>
                    form.DETAILS.map((detail) => detail.PRODUCT_ID).filter(Boolean),
                ),
            ),
        ];
        const products = await this.purConnection.getRepository(Products).find({
            where: { SPRODID: In(productIds) },
        });
        const productMap = new Map(
            products.map((product) => [product.SPRODID, product]),
        );

        return forms.map((form) => ({
            ...form,
            DETAILS: form.DETAILS.map((detail) => ({
                ...detail,
                PRODUCT: productMap.get(detail.PRODUCT_ID) ?? null,
            })),
        }));
    }

    async getFormDetail(data: {
        NFRMNO: number;
        VORGNO: string;
        CYEAR: string;
        CYEAR2: string;
        NRUNNO: number;
    }) {
        const form = await this.getRepository(MFGVTR_FORM).findOne({
            where: {
                NFRMNO: data.NFRMNO,
                VORGNO: data.VORGNO,
                CYEAR: data.CYEAR,
                CYEAR2: data.CYEAR2,
                NRUNNO: data.NRUNNO,
            },
            relations: ['DETAILS'],
        });

        if (!form || form.DETAILS.length === 0) {
            return form;
        }

        const productIds = [
            ...new Set(
                form.DETAILS.map((detail) => detail.PRODUCT_ID).filter(Boolean),
            ),
        ];
        const products = await this.purConnection.getRepository(Products).find({
            where: { SPRODID: In(productIds) },
        });
        const productMap = new Map(
            products.map((product) => [product.SPRODID, product]),
        );

        return {
            ...form,
            DETAILS: form.DETAILS.map((detail) => ({
                ...detail,
                PRODUCT: productMap.get(detail.PRODUCT_ID) ?? null,
            })),
        };
    }

    async updateStatus(data: {
        NFRMNO: number;
        VORGNO: string;
        CYEAR: string;
        CYEAR2: string;
        NRUNNO: number;
        STATUS: string;
    }) {
        const form = await this.getRepository(MFGVTR_FORM).findOne({
            where: {
                NFRMNO: data.NFRMNO,
                VORGNO: data.VORGNO,
                CYEAR: data.CYEAR,
                CYEAR2: data.CYEAR2,
                NRUNNO: data.NRUNNO,
            },
        });
        if (!form) {
            throw new Error('Form not found');
        }

        form.STATUS = data.STATUS;
        return await this.getRepository(MFGVTR_FORM).save(form);
    }
}
