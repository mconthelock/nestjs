import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PSCLM_DETAIL } from 'src/common/Entities/webform/table/PSCLM_DETAIL.entity';
import { PSCLM_FORM } from 'src/common/Entities/webform/table/PSCLM_FORM.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class PsClmRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @InjectDataSource('workloadConnection') private readonly wk: DataSource,
    ) {
        super(ds);
    }

    createForm(dto: Partial<PSCLM_FORM>) {
        return this.manager.query(
            `INSERT INTO WEBFORM.PSCLM_FORM
                (NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, NEWORDER, REMARK)
             VALUES (:1, :2, :3, :4, :5, :6, :7)`,
            [
                dto.NFRMNO,
                dto.VORGNO,
                dto.CYEAR,
                dto.CYEAR2,
                dto.NRUNNO,
                dto.NEWORDER ?? '',
                dto.REMARK ?? '',
            ],
        );
    }

    lockForms() {
        // ponytail: one table lock keeps allocation atomic; replace with a DB unique key/sequence if create throughput matters
        return this.manager.query(
            'LOCK TABLE WEBFORM.PSCLM_FORM IN EXCLUSIVE MODE',
        );
    }

    async findNewOrders(prefix: string): Promise<string[]> {
        const rows = await this.manager.query(
            `SELECT DISTINCT NEWORDER
             FROM WEBFORM.PSCLM_FORM
             WHERE NEWORDER LIKE :1`,
            [`${prefix}%`],
        );
        return rows.map((row) => String(row.NEWORDER || ''));
    }

    async replaceDetails(form: FormDto, details: Partial<PSCLM_DETAIL>[]) {
        await this.manager.query(
            `DELETE FROM WEBFORM.PSCLM_DETAIL
             WHERE NFRMNO = :1
               AND VORGNO = :2
               AND CYEAR = :3
               AND CYEAR2 = :4
               AND NRUNNO = :5`,
            [form.NFRMNO, form.VORGNO, form.CYEAR, form.CYEAR2, form.NRUNNO],
        );
        const inserted = [];
        for (const detail of details) {
            inserted.push(
                await this.manager.query(
                    `INSERT INTO WEBFORM.PSCLM_DETAIL
                        (NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, ORDERNO, ITEM, PARTNAME, DRAWING, VARIABLE, QTY, SCLNO, SCLTYPE, SCHDNUM, SCHDP, ISSUETO, NEXTPROCESS, REMARK)
                     VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17, :18)`,
                    [
                        detail.NFRMNO,
                        detail.VORGNO,
                        detail.CYEAR,
                        detail.CYEAR2,
                        detail.NRUNNO,
                        detail.ORDERNO ?? '',
                        detail.ITEM ?? '',
                        detail.PARTNAME ?? '',
                        detail.DRAWING ?? '',
                        detail.VARIABLE ?? '',
                        detail.QTY ?? 0,
                        detail.SCLNO ?? '',
                        detail.SCLTYPE ?? '',
                        detail.SCHDNUM ?? '',
                        detail.SCHDP ?? '',
                        detail.ISSUETO ?? '',
                        detail.NEXTPROCESS ?? '',
                        detail.REMARK ?? '',
                    ],
                ),
            );
        }
        return inserted;
    }

    async updateDetailSchedules(
        form: FormDto,
        details: Partial<PSCLM_DETAIL>[],
    ) {
        const updated = [];
        for (const detail of details) {
            updated.push(
                await this.manager.query(
                    `UPDATE WEBFORM.PSCLM_DETAIL
                     SET SCHDNUM = :1,
                         SCHDP = :2
                     WHERE NFRMNO = :3
                       AND VORGNO = :4
                       AND CYEAR = :5
                       AND CYEAR2 = :6
                       AND NRUNNO = :7
                       AND ORDERNO = :8
                       AND ITEM = :9
                       AND DRAWING = :10
                       AND PARTNAME = :11
                       AND VARIABLE = :12
                       AND QTY = :13
                       AND SCLNO = :14
                       AND SCLTYPE = :15`,
                    [
                        detail.SCHDNUM ?? '',
                        detail.SCHDP ?? '',
                        form.NFRMNO,
                        form.VORGNO,
                        form.CYEAR,
                        form.CYEAR2,
                        form.NRUNNO,
                        detail.ORDERNO ?? '',
                        detail.ITEM ?? '',
                        detail.DRAWING ?? '',
                        detail.PARTNAME ?? '',
                        detail.VARIABLE ?? '',
                        detail.QTY ?? 0,
                        detail.SCLNO ?? '',
                        detail.SCLTYPE ?? '',
                    ],
                ),
            );
        }
        return updated;
    }

    findOne(dto: FormDto) {
        return this.manager
            .createQueryBuilder(PSCLM_FORM, 'req')
            .leftJoinAndSelect('req.form', 'form')
            .leftJoinAndSelect('req.formmaster', 'formmst')
            .where('req.NFRMNO = :NFRMNO', { NFRMNO: dto.NFRMNO })
            .andWhere('req.VORGNO = :VORGNO', { VORGNO: dto.VORGNO })
            .andWhere('req.CYEAR = :CYEAR', { CYEAR: dto.CYEAR })
            .andWhere('req.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
            .andWhere('req.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO })
            .getOne();
    }

    findList(dto: FormDto) {
        return this.manager.query(
            `SELECT *
             FROM WEBFORM.PSCLM_DETAIL
             WHERE NFRMNO = :1
               AND VORGNO = :2
               AND CYEAR = :3
               AND CYEAR2 = :4
               AND NRUNNO = :5
             ORDER BY ORDERNO, ITEM`,
            [dto.NFRMNO, dto.VORGNO, dto.CYEAR, dto.CYEAR2, dto.NRUNNO],
        );
    }

    async findOneWithList(dto: FormDto) {
        const form = await this.findOne(dto);
        const list = await this.findList(dto);

        return {
            ...form,
            DETAILS: list,
        };
    }

    findReport(year: string | null, filters: Record<string, string> = {}) {
        const formNo =
            "'PS-CLM' || SUBSTR(F.CYEAR2, 3, 2) || '-' || LPAD(F.NRUNNO, 6, '0')";
        const requester =
            "CASE WHEN REQ.SNAME IS NULL THEN F.VREQNO ELSE F.VREQNO || '_' || REQ.SNAME END";
        const query = this.manager
            .createQueryBuilder(PSCLM_DETAIL, 'D')
            .select(formNo, 'FORM_NO')
            .addSelect(requester, 'REQUESTER')
            .addSelect('D.SCLNO', 'CLAIM_SLIP_SCL_NO')
            .addSelect('D.ORDERNO', 'ORIGINAL_ORDER')
            .addSelect('H.NEWORDER', 'NEW_ORDER')
            .addSelect("TRIM(D.SCHDNUM || ' / ' || D.SCHDP)", 'PRODUCTION_P')
            .addSelect('D.ITEM', 'ITEM_NO')
            .addSelect(
                'ROW_NUMBER() OVER (PARTITION BY D.NFRMNO, D.VORGNO, D.CYEAR, D.CYEAR2, D.NRUNNO ORDER BY D.ORDERNO, D.ITEM, D.DRAWING)',
                'SEQ',
            )
            .addSelect('D.DRAWING', 'DRAWING_NO')
            .addSelect('D.PARTNAME', 'DESCRIPTION')
            .addSelect('D.QTY', 'QTY')
            .addSelect('D.ISSUETO', 'ISSUE_TO')
            .addSelect('D.NEXTPROCESS', 'NEXT_PROCESS')
            .addSelect(
                "CASE LOWER(D.SCLTYPE) WHEN 'vendor' THEN '#VEN' WHEN 'subcon' THEN '#SUB' WHEN '1' THEN '#VEN' WHEN '2' THEN '#SUB' ELSE D.SCLTYPE END",
                'VEN_SUB',
            )
            .innerJoin(
                PSCLM_FORM,
                'H',
                [
                    'H.NFRMNO = D.NFRMNO',
                    'H.VORGNO = D.VORGNO',
                    'H.CYEAR = D.CYEAR',
                    'H.CYEAR2 = D.CYEAR2',
                    'H.NRUNNO = D.NRUNNO',
                ].join(' AND '),
            )
            .innerJoin(
                FORM,
                'F',
                [
                    'F.NFRMNO = D.NFRMNO',
                    'F.VORGNO = D.VORGNO',
                    'F.CYEAR = D.CYEAR',
                    'F.CYEAR2 = D.CYEAR2',
                    'F.NRUNNO = D.NRUNNO',
                ].join(' AND '),
            )
            .leftJoin('AMECUSERALL', 'REQ', 'REQ.SEMPNO = F.VREQNO')
            .where('1 = 1')
            .orderBy('F.DREQDATE', 'ASC')
            .addOrderBy('D.NRUNNO', 'ASC')
            .addOrderBy('D.ORDERNO', 'ASC')
            .addOrderBy('D.ITEM', 'ASC');

        if (year) query.andWhere('D.CYEAR2 = :year', { year });
        this.addLikeFilter(query, formNo, 'FORM_NO', filters.FORM_NO);
        this.addLikeFilter(query, requester, 'REQUESTER', filters.REQUESTER);
        this.addLikeFilter(
            query,
            'D.SCLNO',
            'CLAIM_SLIP_SCL_NO',
            filters.CLAIM_SLIP_SCL_NO ?? filters.CLAIM_SLIP_NO,
        );
        const order = filters.ORDER ?? filters.ORDERNO;
        if (order) {
            query.andWhere(
                '(UPPER(D.ORDERNO) LIKE :ORDER_FILTER OR UPPER(H.NEWORDER) LIKE :ORDER_FILTER)',
                {
                    ORDER_FILTER: `%${String(order).trim().toUpperCase()}%`,
                },
            );
        }
        this.addLikeFilter(
            query,
            'D.DRAWING',
            'DRAWING_NO',
            filters.DRAWING_NO,
        );
        this.addLikeFilter(
            query,
            "TRIM(D.SCHDNUM || ' / ' || D.SCHDP)",
            'PRODUCTION',
            filters.PRODUCTION,
        );
        this.addRangeFilter(
            query,
            'D.SCHDNUM',
            'SCHEDULE_FROM',
            'SCHEDULE_TO',
            filters,
        );

        if (filters.FORM_DATE_FROM) {
            query.andWhere(
                "TRUNC(F.DREQDATE) >= TO_DATE(:FORM_DATE_FROM, 'YYYY-MM-DD')",
                {
                    FORM_DATE_FROM: filters.FORM_DATE_FROM,
                },
            );
        }
        if (filters.FORM_DATE_TO) {
            query.andWhere(
                "TRUNC(F.DREQDATE) <= TO_DATE(:FORM_DATE_TO, 'YYYY-MM-DD')",
                {
                    FORM_DATE_TO: filters.FORM_DATE_TO,
                },
            );
        }

        return query.getRawMany();
    }

    private addLikeFilter(query, column: string, name: string, value?: string) {
        if (!value) return;
        query.andWhere(`UPPER(${column}) LIKE :${name}`, {
            [name]: `%${String(value).trim().toUpperCase()}%`,
        });
    }

    private addRangeFilter(
        query,
        column: string,
        fromName: string,
        toName: string,
        filters: Record<string, string>,
    ) {
        if (filters[fromName])
            query.andWhere(`${column} >= :${fromName}`, {
                [fromName]: filters[fromName],
            });
        if (filters[toName])
            query.andWhere(`${column} <= :${toName}`, {
                [toName]: filters[toName],
            });
    }
}
