import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class MasterRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getMaster(
        section: readonly { OWNER: string }[],
        status: number = 1,
    ): Promise<Record<string, unknown>[]> {
        const pivotItems: { owner: string; alias: string }[] = section.map(
            ({ OWNER }) => {
                if (!OWNER) {
                    throw new Error('OWNER name is null');
                }
                // สร้าง alias จาก OWNER (เอามาตัด . ออก)
                const alias: string = OWNER.replace(/\.$/, '');
                return { owner: OWNER, alias };
            },
        );
        // ตรวจสอบว่ามี alias ซ้ำกันหรือไม่
        const aliases: Set<string> = new Set<string>();

        for (const { alias } of pivotItems) {
            if (aliases.has(alias)) {
                throw new Error(
                    `Duplicate chemical section pivot alias: ${alias}`,
                );
            }
            aliases.add(alias);
        }
        const quoteIdentifier = (identifier: string) =>
            `"${identifier.replace(/"/g, '""')}"`;

        // สร้างคำสั่ง SQL สำหรับการเลือกและ pivot ข้อมูลตาม alias ของแต่ละ section
        const select: string = pivotItems
            .map(
                ({ alias }) =>
                    `NVL(${quoteIdentifier(alias)}, 'N') AS ${quoteIdentifier(alias)}`,
            )
            .join(', ');
        const pivot = pivotItems
            .map(
                ({ owner, alias }) =>
                    `'${owner.replace(/'/g, "''")}' AS ${quoteIdentifier(alias)}`,
            )
            .join(', ');

        const activeSectionCondition =
            status === 1 ? 'AND C.STATUS = 1 AND S.STATUS = 1' : '';

        return this.manager.query(
            `
                SELECT 
                    A.AMEC_SDS_ID, 
                    A.RECEIVED_SDS_DATE, 
                    A.EFFECTIVE_DATE,
                    A.PRODUCT_CODE, 
                    A.CHEMICAL_NAME, 
                    A.VENDOR, 
                    A.PUR_INCHARGE,
                    A.UN_CLASS, 
                    A.CLASS, 
                    A.REV, 
                    A.STATUS, 
                    ${select}
                FROM 
                (
                    SELECT 
                        C.*, 
                        REPLACE(T.TYPE_NAME, 'Class ', '') AS CLASS, 
                        S.OWNER
                    FROM STY_CHEMICAL C
                    LEFT JOIN STY_TYPE T
                        ON C.UN_CLASS = T.TYPE_NO
                        AND T.TYPE_CODE = 'CMC'
                    LEFT JOIN STY_CHEMICAL_SECTION S
                        ON S.AMEC_SDS_ID = C.AMEC_SDS_ID
                        ${activeSectionCondition}
                )
                PIVOT (
                    MAX('Y') FOR OWNER IN (${pivot})
                ) A
                WHERE A.STATUS = :1
            `,
            [status],
        );
    }
}
