import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_CHEMICAL } from 'src/common/Entities/gpreport/table/STY_CHEMICAL.entity';
import { STY_TYPE } from 'src/common/Entities/gpreport/table/STY_TYPE.entity';

@Injectable()
export class MasterRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }
    // ไม่ได้ใช้ในตอนนี้ แต่สามารถใช้สำหรับดึงข้อมูล master ของแต่ละ section ได้ แบบไม่ nested
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
                ORDER BY A.AMEC_SDS_ID ASC
            `,
            [status],
        );
    }

    async getMasters({ status, id }: { status: number; id?: number[] }) {
        const query = this.getRepository(STY_CHEMICAL)
            .createQueryBuilder('C')
            .select([
                'C.AMEC_SDS_ID',
                'C.CHEMICAL_NAME',
                'C.UN_CLASS',
                'C.STATUS',
                'C.EFFECTIVE_DATE',
                'C.RECEIVED_SDS_DATE',
                'C.PRODUCT_CODE',
                'C.PUR_INCHARGE',
                'C.REV',
                'C.VENDOR',
                'S.OWNER',
                'S.OWNERCODE',
                'S.AMEC_SDS_ID',
                'S.USED_FOR',
                'S.KEEPING_POINT',
                'S.USED_AREA',
                'S.RECEIVED_SDS_DATE',
                'S.QTY',
                'S.REC4052',
                'S.REC4054',
                'T.TYPE_NAME',
            ])
            .leftJoin('C.SECTIONS', 'S')
            .leftJoinAndMapOne(
                'C.CLASS',
                STY_TYPE,
                'T',
                'T.TYPE_NO = C.UN_CLASS AND T.TYPE_CODE = :typeCode',
                { typeCode: 'CMC' },
            )
            .orderBy('C.AMEC_SDS_ID, S.OWNER', 'ASC');
        if (status === 1) {
            query.andWhere('C.STATUS = :status', { status });
            query.andWhere('S.STATUS = :status', { status });
        } else {
            query.andWhere('C.STATUS = :status', { status });
        }
        if (id && id.length > 0) {
            query.andWhere('C.AMEC_SDS_ID IN (:...id)', { id });
        }
        return query.getMany();
    }

    enable(id: number | number[]) {
        return this.getRepository(STY_CHEMICAL).update(
            Array.isArray(id) ? { AMEC_SDS_ID: In(id) } : { AMEC_SDS_ID: id },
            { STATUS: 1 },
        );
    }

    disable(id: number) {
        return this.getRepository(STY_CHEMICAL).update(
            Array.isArray(id) ? { AMEC_SDS_ID: In(id) } : { AMEC_SDS_ID: id },
            { STATUS: 0 },
        );
    }
}
