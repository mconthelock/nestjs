import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreateCnformDto } from './dto/create-cnform.dto';
import { UpdateCnformDto } from './dto/update-cnform.dto';
import { CNFORM } from 'src/common/Entities/webform/table/CNFORM.entity';
import { CNITMINCHARGE } from 'src/common/Entities/webform/table/CNITMINCHARGE.entity';

@Injectable()
export class CnFormRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: CreateCnformDto) {
        return this.getRepository(CNFORM).insert(dto);
    }

    async create(dto: CreateCnformDto) {
        return this.getRepository(CNFORM).save(dto);
    }

    async findByCondition(con: FormDto) {
        return this.getRepository(CNFORM).find({
            where: {
                ...con,
            },
        });
    }

    async findInc(itm: number): Promise<string | null> {
        const result = await this.getRepository(CNITMINCHARGE).findOne({
            where: { ITEMNO: itm },
            select: ['INCHARGE'], // เลือกดึงมาเฉพาะฟิลด์ที่ต้องการ
        });

        // คืนค่า INCHARGE หากค้นพบข้อมูล หากไม่พบจะคืนค่า null
        return result ? result.INCHARGE : null;
    }

    async update(con: FormDto, dto: UpdateCnformDto): Promise<boolean> {
        const result = await this.getRepository(CNFORM).update(con, dto);
        return (result.affected ?? 0) > 0;
    }

    async deleteAll(dto: FormDto) {
        return this.getRepository(CNFORM).delete(dto);
    }

    async getFirstNo(con: FormDto): Promise<any> {
        return await this.getRepository(CNFORM)
            .createQueryBuilder('cnform')
            // ใช้ Raw Query สำหรับ REGEXP_SUBSTR และตั้งชื่อ AS ว่า FIRSTNO
            .select("REGEXP_SUBSTR(cnform.RSNOTHER, 'F[0-9]+')", 'FIRSTNO')
            .where('cnform.NFRMNO = :nfrmno', { nfrmno: con.NFRMNO })
            .andWhere('cnform.VORGNO = :vorgno', { vorgno: con.VORGNO })
            .andWhere('cnform.CYEAR = :cyear', { cyear: con.CYEAR })
            .andWhere('cnform.CYEAR2 = :cyear2', { cyear2: con.CYEAR2 })
            .andWhere('cnform.NRUNNO = :nrunno', { nrunno: con.NRUNNO })
            // getRawMany() จะรีเทิร์นค่าออกมาเป็น Array Object คล้ายกับ result() ของ CodeIgniter
            .getRawOne();
    }
    async getQueryBuilderResult(dto: FormDto) {
        return await this.getRepository(CNFORM)
            // 1. เปลี่ยน Alias หลักเป็นตัวพิมพ์ใหญ่ (CNF)
            .createQueryBuilder('CNF')
            .select([
                'CNJ.JDGMNTNO AS jdgmntno',
                'CNJ.JUDGEMENT AS judgement',
                'CNF.JDGOTHER AS jdgother',
                'CNF.SVENDNAME AS svendname',
                'CNF.PRTNAME AS prtname',
                'CHK.DWGNO AS dwgno',
                'CHK.RESULT AS result',
            ])
            // 2. อ้างอิงตัวแปรเป็น CNF ตัวพิมพ์ใหญ่
            .addSelect("REGEXP_SUBSTR(CNF.RSNOTHER, 'F[0-9]+')", 'FIRSTNO')
            .addSelect(
                "REGEXP_SUBSTR(CNF.DETTRANS, 'shop at\\s*(.*)', 1, 1, NULL, 1)",
                'SHOPNO',
            )

            // 3. เปลี่ยนชื่อย่อตาราง JOIN เป็น CNJ และ CHK ตัวพิมพ์ใหญ่
            .leftJoin('CNJUDGEMENT', 'CNJ', 'CNJ.JDGMNTNO = CNF.JDGMNTNO')
            .innerJoin(
                'RESULTCHKDWG',
                'CHK',
                `CHK.NFRMNO = CNF.NFRMNO
            AND CHK.VORGNO = CNF.VORGNO
            AND CHK.CYEAR  = CNF.CYEAR
            AND CHK.CYEAR2 = CNF.CYEAR2
            AND CHK.NRUNNO = CNF.NRUNNO`,
            )

            // 4. เงื่อนไข WHERE ก็ใช้ CNF ตัวพิมพ์ใหญ่เช่นกัน
            .where('CNF.NFRMNO = :nfrmno', { nfrmno: dto.NFRMNO })
            .andWhere('CNF.VORGNO = :vorgno', { vorgno: dto.VORGNO })
            .andWhere('CNF.CYEAR = :cyear', { cyear: dto.CYEAR })
            .andWhere('CNF.CYEAR2 = :cyear2', { cyear2: dto.CYEAR2 })
            .andWhere('CNF.NRUNNO = :nrunno', { nrunno: dto.NRUNNO })

            .getRawMany();
    }

    async getApvEmail(dto: FormDto, type: string): Promise<any[]> {
        const baseConditions = {
            nfrmno: dto.NFRMNO,
            vorgno: dto.VORGNO,
            cyear: dto.CYEAR,
            cyear2: dto.CYEAR2,
            nrunno: dto.NRUNNO,
        };

        const qb = this.manager
            .createQueryBuilder()
            .select('E.SRECMAIL', 'EMAIL')
            .from('AMEC.AMECUSERALL', 'E')
            .distinct(true)
            .where("E.CSTATUS = '1'");

        if (type === 'PIC') {
            qb.andWhere(
                new Brackets((qb2) => {
                    qb2.orWhere(`E.SEMPNO IN (
                    SELECT F.VAPVNO FROM FLOW F
                    WHERE F.NFRMNO = :nfrmno AND F.VORGNO = :vorgno
                      AND F.CYEAR = :cyear AND F.CYEAR2 = :cyear2 AND F.NRUNNO = :nrunno
                      AND F.CSTEPNO = '--'
                )`).orWhere(`E.SEMPNO IN (
                    SELECT F.VREPNO FROM FLOW F
                    WHERE F.NFRMNO = :nfrmno AND F.VORGNO = :vorgno
                      AND F.CYEAR = :cyear AND F.CYEAR2 = :cyear2 AND F.NRUNNO = :nrunno
                      AND F.CSTEPNO = '--'
                )`).orWhere(`E.SEMPNO IN (
                    SELECT C.ENG FROM CNSHOPPIC C
                    WHERE C.FM IN (
                        SELECT F2.VAPVNO FROM FLOW F2
                        WHERE F2.NFRMNO = :nfrmno AND F2.VORGNO = :vorgno
                          AND F2.CYEAR = :cyear AND F2.CYEAR2 = :cyear2 AND F2.NRUNNO = :nrunno
                          AND F2.CEXTDATA = '06'
                    )
                )`);
                }),
            );
        } else {
            // -------------------------------------------------------------
            // 📍 จุดที่เปลี่ยน: หาอีเมลจาก VAPVNO หรือ VREPNO แทน VREALAPV
            // -------------------------------------------------------------
            qb.innerJoin(
                'FLOW',
                'F',
                '(F.VAPVNO = E.SEMPNO OR F.VREPNO = E.SEMPNO)',
            )
                .andWhere('F.NFRMNO = :nfrmno')
                .andWhere('F.VORGNO = :vorgno')
                .andWhere('F.CYEAR = :cyear')
                .andWhere('F.CYEAR2 = :cyear2')
                .andWhere('F.NRUNNO = :nrunno');

            if (type === 'REQUESTER') {
                qb.andWhere("F.CSTEPNO = '--'");
            } else if (type === 'FOREMAN') {
                qb.andWhere("F.CEXTDATA = '06'");
            } else if (type === 'ALL') {
                qb.andWhere("F.CSTEPNO NOT IN ('05','04','11')");
            }
        }

        qb.setParameters(baseConditions);

        // --- ลบ Debug ทิ้งได้เลยถ้าทำงานปกติแล้ว ---
        // console.log('--- GENERATED SQL ---');
        // console.log(qb.getSql());
        // console.log('--- PARAMETERS ---');
        // console.log(qb.getParameters());
        // --------------------------------

        return await qb.getRawMany();
    }
    async executeRawSql(sql: string, params: any[]): Promise<any[]> {
        // console.log('DATABASE:', this.manager.connection.options);
        // const res = await this.manager.query(
        //     `SELECT *
        //  FROM "FLOW" T1
        //  JOIN "AMEC"."AMECUSERALL" T2
        //      ON T1.VREALAPV = T2.SEMPNO
        //  WHERE T1.NFRMNO = 4
        //    AND T1.VORGNO = '050301'
        //    AND T1.CYEAR = '10'
        //    AND T1.CYEAR2 = '2026'
        //    AND T1.NRUNNO = 1389`,
        // );
        const res = await this.manager.query(sql, params);
        console.log('***********', res);

        return res;
    }
}
